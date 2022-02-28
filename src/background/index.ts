import ky from "ky";
import { castArray, chunk, find, map, reject, some, sortBy } from "lodash-es";
import browser, { Storage } from "webextension-polyfill";

import { Dictionary } from "@/common/types";
import { stores } from "@/common/stores";

export const client = ky.extend({
  prefixUrl: "https://api.twitch.tv/helix/",
  headers: {
    "Client-ID": process.env.TWITCH_CLIENT_ID,
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        const accessToken = await stores.accessToken.get();

        if (accessToken == null) {
          return;
        }

        request.headers.set("Authorization", `Bearer ${accessToken}`);
      },
    ],
  },
});

async function request(url: string, params: Record<string, any> = {}) {
  const searchParams = new URLSearchParams();

  for (const [name, value] of Object.entries(params ?? {})) {
    for (const v of castArray(value)) {
      if (typeof v === "undefined") {
        continue;
      }

      searchParams.append(name, v.toString());
    }
  }

  return client(url, { searchParams }).json<any>();
}

async function fetchCurrentUser(): Promise<any> {
  return (await request("users")).data[0];
}

async function fetchUsers(id: string[]): Promise<any[]> {
  return (await request("users", { id })).data;
}

async function fetchFollowedUsers(userId: string, after?: string): Promise<any[]> {
  const { data: follows, pagination } = await request("users/follows", {
    from_id: userId,
    first: 100,
    after,
  });

  const { data: users } = await request("users", {
    id: map(follows, "to_id"),
  });

  if (pagination.cursor) {
    users.push(...(await fetchFollowedUsers(userId, pagination.cursor)));
  }

  return sortBy(users, "login");
}

async function fetchFollowedStreams(userId: string, after?: string): Promise<any[]> {
  const { data: followedUsers, pagination } = await request("streams/followed", {
    user_id: userId,
    first: 100,
    after,
  });

  if (pagination.cursor) {
    followedUsers.push(...(await fetchFollowedStreams(userId, pagination.cursor)));
  }

  return followedUsers;
}

async function filterNewStreams(streams: any[]): Promise<any[]> {
  const followedStreams = await stores.followedStreams.get();

  return reject(streams, (stream) =>
    some(followedStreams, {
      id: stream.id,
    })
  );
}

async function refreshCurrentUser(accessToken: string) {
  let currentUser = null;

  if (accessToken) {
    currentUser = await fetchCurrentUser();
  }

  await stores.currentUser.set(currentUser);

  return currentUser;
}

async function refreshFollowedUsers(currentUser: any) {
  let followedUsers = [];

  if (currentUser) {
    followedUsers = await fetchFollowedUsers(currentUser.id);
  }

  await stores.followedUsers.set(followedUsers);
}

async function refreshFollowedStreams(currentUser: any, showNotifications = true) {
  let followedStreams = [];

  if (currentUser) {
    followedStreams = await fetchFollowedStreams(currentUser.id);

    const { notifications } = await stores.settings.get();

    if (showNotifications && notifications.enabled) {
      let newStreams = await filterNewStreams(followedStreams);

      if (notifications.withFilters) {
        newStreams = newStreams.filter((stream) =>
          notifications.selectedUsers.includes(stream.user_id)
        );
      }

      for (const streams of chunk(newStreams, 100)) {
        const users = await fetchUsers(map(streams, "user_id"));

        streams.forEach((stream) => {
          const user = find(users, {
            id: stream.user_id,
          });

          browser.notifications.create(user.login, {
            title: `${user.display_name || user.login} is online`,
            contextMessage: "Click to open the channel page",
            eventTime: Date.parse(stream.started_at),
            iconUrl: user.profile_image_url,
            message: stream.title,
            isClickable: true,
            type: "basic",
          });
        });
      }
    }
  }

  let text = "";

  if (followedStreams.length > 0) {
    text = followedStreams.length.toLocaleString("en-US");
  }

  const manifest = browser.runtime.getManifest();
  const browserAction = manifest.manifest_version === 2 ? browser.browserAction : browser.action;

  await Promise.all([
    stores.followedStreams.set(followedStreams),
    browserAction.setBadgeBackgroundColor({
      color: "#000000",
    }),
    browserAction.setBadgeText({
      text,
    }),
  ]);
}

async function refresh(withNotifications = true) {
  const currentUser = await refreshCurrentUser(await stores.accessToken.get());

  await Promise.all([
    refreshFollowedStreams(currentUser, withNotifications),
    refreshFollowedUsers(currentUser),
  ]);
}

const messageHandlers: Record<string, (...args: any[]) => Promise<any>> = {
  async authorize() {
    const loginUrl = new URL("https://id.twitch.tv/oauth2/authorize");

    loginUrl.searchParams.set("client_id", process.env.TWITCH_CLIENT_ID as string);
    loginUrl.searchParams.set("redirect_uri", browser.identity.getRedirectURL("/callback"));
    loginUrl.searchParams.set("response_type", "token");
    loginUrl.searchParams.set("scope", "user:edit:follows user:read:follows");

    const result = await browser.identity.launchWebAuthFlow({
      url: loginUrl.href,
      interactive: true,
    });

    const url = new URL(result);
    const params = new URLSearchParams(url.hash.substring(1));

    stores.accessToken.set(params.get("access_token"));
  },
  async request([url, params]) {
    return request(url, params);
  },
};

const storageChangeHandlers: Record<string, Dictionary<(change: Storage.StorageChange) => void>> = {
  sync: {
    accessToken() {
      refresh(false);
    },
  },
};

browser.alarms.onAlarm.addListener(() => {
  refresh();
});

browser.notifications.onClicked.addListener((notificationId) => {
  browser.tabs.create({
    url: `https://twitch.tv/${notificationId}`,
  });
});

browser.runtime.onInstalled.addListener(async () => {
  await Promise.allSettled(map(stores, (store) => store.migrate()));

  browser.alarms.create({
    periodInMinutes: 1,
  });

  refresh(false);
});

browser.runtime.onMessage.addListener(async (message) => {
  const { [message.type]: handler } = messageHandlers;

  if (handler == null) {
    throw new RangeError();
  }

  return handler(message.args);
});

browser.storage.onChanged.addListener((changes, areaName) => {
  const { [areaName]: handlers } = storageChangeHandlers;

  if (handlers == null) {
    return;
  }

  for (const [name, change] of Object.entries(changes)) {
    const { [name]: handler } = handlers;

    if (handler == null) {
      continue;
    }

    handler(change);
  }
});
