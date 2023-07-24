import {
  camelCase,
  castArray,
  chunk,
  find,
  flatMap,
  get,
  map,
  remove,
  snakeCase,
  toString,
} from "lodash-es";

import { AUTHORIZE_URL } from "~/common/constants";
import {
  allPromises,
  changeCase,
  matchString,
  openUrl,
  settlePromises,
  setupSentry,
  t,
} from "~/common/helpers";
import { stores } from "~/common/stores";
import { Dictionary, HelixResponse, HelixStream, HelixUser } from "~/common/types";

setupSentry();

class RequestError extends Error {
  constructor(readonly request: Request, readonly response: Response) {
    super(response.statusText);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequestError);
    }
  }
}

async function request<T>(path: string, params?: Dictionary<unknown>): Promise<HelixResponse<T>> {
  const url = new URL(path, "https://api.twitch.tv/helix/");

  for (const [name, value] of Object.entries(params ?? {})) {
    for (const v of castArray(value)) {
      if (typeof v === "undefined") {
        continue;
      }

      url.searchParams.append(snakeCase(name), toString(v));
    }
  }

  const request = new Request(url, {
    cache: "no-cache",
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID as string,
    },
  });

  const accessToken = await stores.accessToken.get();

  if (accessToken) {
    request.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(request);

  switch (response.status) {
    case 204:
      return undefined as never;

    case 401: {
      if (await stores.accessToken.set(null)) {
        browser.notifications.create(`${Date.now()}:authorize`, {
          title: t("notificationTitle_accessExpired"),
          message: t("notificationMessage_accessExpired"),
          iconUrl: browser.runtime.getURL("icon-96.png"),
          type: "basic",
        });
      }

      break;
    }
  }

  if (response.ok) {
    return changeCase(await response.json(), camelCase);
  }

  throw new RequestError(request, response);
}

async function paginate<T>(path: string, params?: Dictionary<unknown>): Promise<T[]> {
  const { data, pagination } = await request<T>(path, params);

  if (pagination.cursor) {
    return data.concat(await paginate(path, { ...params, after: pagination.cursor }));
  }

  return data;
}

async function getCurrentUser() {
  return get(await request<HelixUser>("users"), ["data", 0], null);
}

async function getUsersByIds(userIds: string[]) {
  const pages = await allPromises(chunk(userIds, 100), async (id) => {
    const { data } = await request<HelixUser>("users", {
      id,
    });

    return data;
  });

  return flatMap(pages);
}

async function getFollowedStreams(userId: string) {
  const followedStreams = await paginate<HelixStream>("streams/followed", {
    first: 100,
    userId,
  });

  return followedStreams;
}

async function filterFollowedStreams(streams: HelixStream[]) {
  const [followedStreams, settings] = await Promise.all([
    stores.followedStreams.get(),
    stores.settings.get(),
  ]);

  const {
    notifications: { ignoredCategories, selectedUsers, withCategoryChanges, withFilters },
  } = settings;

  return streams.filter((stream) => {
    if (
      (withFilters && !selectedUsers.includes(stream.userId)) ||
      ignoredCategories.some(matchString.bind(null, stream.gameName))
    ) {
      return false;
    }

    const oldStream = find(followedStreams, {
      userId: stream.userId,
    });

    return oldStream == null || (withCategoryChanges && oldStream.gameId !== stream.gameId);
  });
}

async function refreshCurrentUser(accessToken: string | null) {
  let currentUser = null;

  if (accessToken) {
    currentUser = await getCurrentUser();
  }

  await stores.currentUser.set(currentUser);

  return currentUser;
}

async function refreshFollowedStreams(user: HelixUser, showNotifications = true) {
  const settings = await stores.settings.get();

  let followedStreams = new Array<HelixStream>();

  if (user) {
    followedStreams = await getFollowedStreams(user.id);

    if (!settings.streams.withReruns) {
      remove(followedStreams, (stream) => stream.tags?.includes("Rerun"));
    }

    if (showNotifications && settings.notifications.enabled) {
      const streams = await filterFollowedStreams(followedStreams);
      const users = await getUsersByIds(map(streams, "userId"));

      settlePromises(streams, async (stream) => {
        const create = (iconUrl = browser.runtime.getURL("icon-96.png")) =>
          browser.notifications.create(`${Date.now()}:stream:${stream.userLogin}`, {
            title: t(`notificationMessage_stream${stream.gameName ? "Playing" : "Online"}`, [
              stream.userName || stream.userLogin,
              stream.gameName,
            ]),
            message: stream.title || t("detailText_noTitle"),
            type: "basic",
            iconUrl,
          });

        try {
          const user = find(users, {
            id: stream.userId,
          });

          if (user) {
            return await create(user.profileImageUrl);
          }
        } catch {} // eslint-disable-line no-empty

        await create();
      });
    }
  }

  await stores.followedStreams.set(followedStreams);
}

async function refresh(withNotifications: boolean) {
  try {
    const user = await refreshCurrentUser(await stores.accessToken.get());

    if (user) {
      await refreshFollowedStreams(user, withNotifications);
    }
  } catch {} // eslint-disable-line no-empty

  browser.alarms.create("refresh", {
    delayInMinutes: 1,
  });
}

async function refreshActionBadge() {
  const manifest = browser.runtime.getManifest();
  const browserAction = manifest.manifest_version === 2 ? browser.browserAction : browser.action;

  const [currentUser, followedStreams, settings] = await Promise.all([
    stores.currentUser.get(),
    stores.followedStreams.get(),
    stores.settings.get(),
  ]);

  let text = "";

  if (settings.badge.enabled && followedStreams.length > 0) {
    text = followedStreams.length.toLocaleString("en-US");
  }

  const getIconPath = (size: number) =>
    browser.runtime.getURL(currentUser ? `icon-${size}.png` : `icon-gray-${size}.png`);

  await Promise.allSettled([
    browserAction.setBadgeBackgroundColor({
      color: settings.badge.color,
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

async function backup() {
  const [followedStreamState, followedUserState, collections, settings] = await Promise.all([
    stores.followedStreamState.getState(),
    stores.followedUserState.getState(),
    stores.collections.getState(),
    stores.settings.getState(),
  ]);

  return {
    followedStreamState,
    followedUserState,
    collections,
    settings,
  };
}

async function restore(data: Dictionary<unknown>) {
  await settlePromises(Object.entries(data), async ([name, state]) => {
    const store = get(stores, name);

    if (store) {
      await store.restore(state);
    }
  });
}

async function authorize() {
  return openUrl(AUTHORIZE_URL, undefined, true);
}

async function setup(): Promise<void> {
  const items = await browser.storage.local.get();

  await settlePromises(Object.values(stores), (store) => store.setup(true));
  await settlePromises(Object.keys(items), async (key) => {
    if (key in stores) {
      return;
    }

    return browser.storage.local.remove(key);
  });
}

async function reset(): Promise<void> {
  await Promise.allSettled([
    browser.storage.local.clear(),
    browser.storage.managed.clear(),
    browser.storage.sync.clear(),
  ]);

  await setup();
}

async function revoke() {
  const token = await stores.accessToken.get();

  if (token) {
    fetch("https://id.twitch.tv/oauth2/revoke", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.TWITCH_CLIENT_ID as string,
        token,
      }),
    });
  }

  await stores.accessToken.reset();
}

const messageHandlers: Dictionary<(...args: any[]) => Promise<any>> = {
  authorize,
  backup,
  refresh,
  request,
  reset,
  restore,
  revoke,
};

browser.alarms.onAlarm.addListener((alarm) => {
  refresh(Date.now() < alarm.scheduledTime + 300_000);
});

browser.notifications.onClicked.addListener((notificationId) => {
  const [, type, data] = notificationId.split(":");

  switch (type) {
    case "authorize":
      return authorize();

    case "stream":
      return openUrl(`https://twitch.tv/${data}`);

    case "update":
      return openUrl("https://github.com/Seldszar/Gumbo/blob/main/CHANGELOG.md");
  }
});

browser.runtime.onInstalled.addListener((details) => {
  setup();

  if (details.previousVersion) {
    const manifest = browser.runtime.getManifest();

    if (manifest.version > details.previousVersion) {
      browser.notifications.create(`${Date.now()}:update`, {
        title: t("notificationMessage_extensionUpdated", manifest.version),
        message: t("notificationContextMessage_extensionUpdated"),
        iconUrl: browser.runtime.getURL("icon-96.png"),
        type: "basic",
      });
    }
  }
});

browser.runtime.onStartup.addListener(() => {
  setup();
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
  refresh(false);
});

stores.followedStreams.onChange(() => {
  refreshActionBadge();
});

stores.settings.onChange(() => {
  refreshActionBadge();
});
