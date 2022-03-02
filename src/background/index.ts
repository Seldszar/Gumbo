import { init } from "@sentry/browser";
import ky from "ky";
import { castArray, chunk, filter, find, map, reject, some, sortBy } from "lodash-es";
import browser, { Storage } from "webextension-polyfill";

import { Dictionary } from "@/common/types";
import { stores } from "@/common/stores";

init({
  dsn: process.env.SENTRY_DSN,
});

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
  const { data: followedStreams, pagination } = await request("streams/followed", {
    user_id: userId,
    first: 100,
    after,
  });

  const { data: streams } = await request("streams", {
    user_id: map(followedStreams, "user_id"),
    first: 100,
  });

  for (const followedStream of followedStreams) {
    const stream = find(streams, {
      user_id: followedStream.user_id,
    });

    if (stream == null) {
      followedStream.type = "rerun";
    }
  }

  if (pagination.cursor) {
    followedStreams.push(...(await fetchFollowedStreams(userId, pagination.cursor)));
  }

  return followedStreams;
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

    const { notifications, streams } = await stores.settings.get();

    if (!streams.withReruns) {
      followedStreams = filter(followedStreams, {
        type: "live",
      });
    }

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

let isRefreshing = false;

async function refresh(withNotifications = true) {
  if (isRefreshing) {
    return;
  }

  isRefreshing = true;

  try {
    const currentUser = await refreshCurrentUser(await stores.accessToken.get());

    await Promise.all([
      refreshFollowedStreams(currentUser, withNotifications),
      refreshFollowedUsers(currentUser),
    ]);
  } catch {} // eslint-disable-line no-empty

  isRefreshing = false;
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

browser.alarms.create({
  periodInMinutes: 1,
});

browser.notifications.onClicked.addListener((notificationId) => {
  browser.tabs.create({
    url: `https://twitch.tv/${notificationId}`,
  });
});

async function setup(migrate = false): Promise<void> {
  if (migrate) {
    await Promise.allSettled(map(stores, (store) => store.migrate()));
  }

  await refresh(false);
}

browser.runtime.onInstalled.addListener(async (detail) => {
  if (detail.reason === "browser_update") {
    return;
  }

  setup(true);
});

browser.runtime.onStartup.addListener(() => {
  setup(false);
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
