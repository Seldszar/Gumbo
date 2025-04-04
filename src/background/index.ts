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
  isRerunStream,
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
  constructor(
    readonly request: Request,
    readonly response: Response,
  ) {
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

async function filterNewStreams(newStreams: HelixStream[], oldStreams: HelixStream[]) {
  const settings = await stores.settings.get();

  const {
    notifications: { ignoredCategories, selectedUsers, withCategoryChanges, withFilters },
  } = settings;

  return newStreams.filter((stream) => {
    if (
      (withFilters && !selectedUsers.includes(stream.userId)) ||
      ignoredCategories.some((input) => matchString(stream.gameName, input))
    ) {
      return false;
    }

    const oldStream = find(oldStreams, {
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

async function refreshFollowedStreams(user: HelixUser) {
  const settings = await stores.settings.get();

  let followedStreams = new Array<HelixStream>();

  if (user) {
    followedStreams = await getFollowedStreams(user.id);

    if (!settings.streams.withReruns) {
      remove(followedStreams, isRerunStream);
    }
  }

  await stores.followedStreams.set(followedStreams);
}

async function refresh() {
  try {
    const user = await refreshCurrentUser(await stores.accessToken.get());

    if (user) {
      await refreshFollowedStreams(user);
    }
  } catch {} // eslint-disable-line no-empty

  browser.alarms.clearAll();
  browser.alarms.create("refresh", {
    delayInMinutes: 1,
  });
}

async function sendNotifications(newStreams: HelixStream[], oldStreams: HelixStream[]) {
  const settings = await stores.settings.get();

  if (settings.notifications.enabled) {
    const filteredStreams = await filterNewStreams(newStreams, oldStreams);
    const users = await getUsersByIds(map(filteredStreams, "userId"));

    settlePromises(filteredStreams, async (stream) => {
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

async function refreshActionBadge(count: number) {
  const [currentUser, settings] = await Promise.all([
    stores.currentUser.get(),
    stores.settings.get(),
  ]);

  let text = "";

  if (settings.badge.enabled && count > 0) {
    text = count.toLocaleString("en-US");
  }

  const getIconPath = (size: number) =>
    browser.runtime.getURL(currentUser ? `icon-${size}.png` : `icon-gray-${size}.png`);

  await Promise.allSettled([
    browser.action.setBadgeBackgroundColor({
      color: settings.badge.color,
    }),
    browser.action.setBadgeText({
      text,
    }),
    browser.action.setIcon({
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

async function reset(): Promise<void> {
  await Promise.allSettled([
    browser.storage.local.clear(),
    browser.storage.session.clear(),
    browser.storage.sync.clear(),
  ]);

  await refresh();
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

browser.alarms.onAlarm.addListener(() => refresh());

browser.notifications.onClicked.addListener((notificationId) => {
  const [, type, data] = notificationId.split(":");

  switch (type) {
    case "authorize":
      return authorize();

    case "stream":
      return openUrl(`https://twitch.tv/${data}`);
  }
});

const messageHandlers: Dictionary<(...args: any[]) => Promise<any>> = {
  authorize,
  backup,
  refresh,
  request,
  reset,
  restore,
  revoke,
};

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

stores.accessToken.onChange(() => refresh());
stores.settings.onChange(() => refresh());

stores.followedStreams.onChange((newValue, oldValue) => {
  if (Array.isArray(oldValue)) {
    sendNotifications(newValue, oldValue);
  }

  refreshActionBadge(newValue.length);
});

refresh();
