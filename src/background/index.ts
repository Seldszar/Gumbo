import ky from "ky";
import { castArray, chunk, filter, find, map, reject, some, sortBy } from "lodash-es";

import { AUTHORIZE_URL } from "@/common/constants";
import { openUrl, setupErrorTracking } from "@/common/helpers";
import { Store, stores } from "@/common/stores";
import { Dictionary } from "@/common/types";

setupErrorTracking();

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
    afterResponse: [
      async (input, options, response) => {
        if (response.status === 401 && (await stores.accessToken.set(null))) {
          browser.notifications.create(`${Date.now()}:authorize`, {
            title: "Access Expired",
            contextMessage: "Click to authorize",
            message: "Your Twitch access token expired, please re-authorize to get a new one.",
            iconUrl: browser.runtime.getURL("icon-96.png"),
            isClickable: true,
            type: "basic",
          });
        }

        return response;
      },
    ],
  },
});

async function request(url: string, params: Dictionary<any> = {}) {
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

async function refreshCurrentUser(accessToken: string | null) {
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
  const settings = await stores.settings.get();

  let followedStreams = [];

  if (currentUser) {
    followedStreams = await fetchFollowedStreams(currentUser.id);

    if (!settings.streams.withReruns) {
      followedStreams = filter(followedStreams, {
        type: "live",
      });
    }

    if (showNotifications && settings.notifications.enabled) {
      let newStreams = await filterNewStreams(followedStreams);

      if (settings.notifications.withFilters) {
        newStreams = newStreams.filter((stream) =>
          settings.notifications.selectedUsers.includes(stream.user_id)
        );
      }

      for (const streams of chunk(newStreams, 100)) {
        const users = await fetchUsers(map(streams, "user_id"));

        Promise.allSettled(
          streams.map(async (stream) => {
            const create = (iconUrl = browser.runtime.getURL("icon-96.png")) =>
              browser.notifications.create(`${Date.now()}:stream:${stream.user_login}`, {
                title: `${stream.user_name || stream.user_login} is online`,
                contextMessage: stream.game_name,
                eventTime: Date.parse(stream.started_at),
                message: stream.title,
                isClickable: true,
                type: "basic",
                iconUrl,
              });

            try {
              const user = find(users, {
                id: stream.user_id,
              });

              if (user) {
                return await create(user.profile_image_url);
              }
            } catch {} // eslint-disable-line no-empty

            await create();
          })
        );
      }
    }
  }

  await stores.followedStreams.set(followedStreams);
}

async function refresh(withNotifications = true, resetAlarm = false) {
  await stores.isRefreshing.set(true);

  if (resetAlarm) {
    browser.alarms.clear("refresh");
  }

  try {
    const currentUser = await refreshCurrentUser(await stores.accessToken.get());

    await Promise.allSettled([
      refreshFollowedStreams(currentUser, withNotifications),
      refreshFollowedUsers(currentUser),
    ]);
  } catch {} // eslint-disable-line no-empty

  if (resetAlarm) {
    browser.alarms.create("refresh", {
      periodInMinutes: 1,
    });
  }

  await stores.isRefreshing.set(false);
}

async function refreshActionBadge(): Promise<void> {
  const manifest = browser.runtime.getManifest();
  const browserAction = manifest.manifest_version === 2 ? browser.browserAction : browser.action;

  const [currentUser, followedStreams, settings] = await Promise.all([
    stores.currentUser.get(),
    stores.followedStreams.get(),
    stores.settings.get(),
  ]);

  let text = "";

  if (settings.general.withBadge && followedStreams.length > 0) {
    text = followedStreams.length.toLocaleString("en-US");
  }

  const getIconPath = (size: number) =>
    browser.runtime.getURL(currentUser ? `icon-${size}.png` : `icon-gray-${size}.png`);

  await Promise.allSettled([
    browserAction.setBadgeBackgroundColor({
      color: "#000000",
    }),
    browserAction.setBadgeText({
      text,
    }),
    browserAction.setIcon({
      path: {
        16: getIconPath(16),
        32: getIconPath(32),
      },
    }),
  ]);
}

async function backup(): Promise<any> {
  const [followedStreamState, followedUserState, pinnedUsers, settings] = await Promise.all([
    stores.followedStreamState.getState(),
    stores.followedUserState.getState(),
    stores.pinnedUsers.getState(),
    stores.settings.getState(),
  ]);

  return {
    followedStreamState,
    followedUserState,
    pinnedUsers,
    settings,
  };
}

async function restore(data: any): Promise<void> {
  const restoreStore = async (store: Store<any>) => {
    const state = data[store.name];

    if (state) {
      await store.restore(state);
    }
  };

  await Promise.all([
    restoreStore(stores.followedStreamState),
    restoreStore(stores.followedUserState),
    restoreStore(stores.pinnedUsers),
    restoreStore(stores.settings),
  ]);
}

async function authorize(): Promise<void> {
  return openUrl(AUTHORIZE_URL);
}

async function ping(): Promise<Date> {
  return new Date();
}

const messageHandlers: Dictionary<(...args: any[]) => Promise<any>> = {
  authorize,
  backup,
  ping,
  refresh,
  request,
  restore,
};

browser.alarms.onAlarm.addListener(() => {
  refresh();
});

browser.notifications.onClicked.addListener((notificationId) => {
  const [, type, data] = notificationId.split(":");

  switch (type) {
    case "authorize":
      return authorize();

    case "stream":
      return openUrl(`https://twitch.tv/${data}`);
  }
});

async function setup(migrate = false): Promise<void> {
  await Promise.allSettled(map(stores, (store) => store.setup(migrate)));

  await refresh(false, true);
}

browser.runtime.onInstalled.addListener((detail) => {
  if (detail.reason === "browser_update") {
    return;
  }

  setup(true);
});

browser.runtime.onStartup.addListener(() => {
  setup(false);
});

browser.runtime.onMessage.addListener((message) => {
  const { [message.type]: handler } = messageHandlers;

  if (handler == null) {
    throw new RangeError();
  }

  return handler(...message.args);
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url?.startsWith(process.env.TWITCH_REDIRECT_URI as string)
  ) {
    const url = new URL(tab.url);
    const hashParams = new URLSearchParams(url.hash.substring(1));

    const accessToken = hashParams.get("access_token");

    if (accessToken) {
      stores.accessToken.set(accessToken);
    }
  }
});

stores.accessToken.onChange(() => {
  refresh(false, true);
});

stores.followedStreams.onChange(() => {
  refreshActionBadge();
});

stores.settings.onChange((newValue, oldValue) => {
  if (newValue.general.withBadge === oldValue?.general.withBadge) {
    return;
  }

  refreshActionBadge();
});
