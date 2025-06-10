import { camelCase, castArray, chunk, find, get, snakeCase, toString } from "es-toolkit/compat";

import { allPromises, changeCase, isRerunStream, matchString, openUrl, t } from "~/common/helpers";
import { stores } from "~/common/stores";
import { Dictionary, HelixResponse, HelixStream, HelixUser } from "~/common/types";

import { createNotification } from "./notification";

class RequestError extends Error {
  constructor(
    readonly request: Request,
    readonly response: Response,
  ) {
    super(`Request failed with status code ${response.status}: ${request.method} ${request.url}`);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequestError);
    }
  }
}

export async function request<T>(
  path: string,
  params?: Dictionary<unknown>,
): Promise<HelixResponse<T>> {
  const url = new URL(path, "https://api.twitch.tv/helix/");

  for (const [name, value] of Object.entries(params ?? {})) {
    for (const v of castArray(value)) {
      if (v === undefined) {
        continue;
      }

      url.searchParams.append(snakeCase(name), toString(v));
    }
  }

  const request = new Request(url, {
    headers: {
      "Client-ID": process.env.TWITCH_CLIENT_ID,
    },
  });

  const accessToken = await stores.accessToken.get();

  if (accessToken) {
    request.headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(request);

  if (response.status === 204) {
    return undefined as never;
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

export async function getCurrentUser() {
  return get(await request<HelixUser>("users"), "data.0", null);
}

export async function getUsersByIds(userIds: string[]) {
  const pages = await allPromises(chunk(userIds, 100), async (id) =>
    get(await request<HelixUser>("users", { id }), "data"),
  );

  return pages.flat();
}

export async function getFollowedStreams(userId: string) {
  const followedStreams = await paginate<HelixStream>("streams/followed", {
    first: 100,
    userId,
  });

  const settings = await stores.settings.get();

  if (settings.streams.withReruns) {
    return followedStreams;
  }

  return followedStreams.filter((stream) => !isRerunStream(stream));
}

export async function authorize() {
  const url = new URL("https://id.twitch.tv/oauth2/authorize");

  url.searchParams.set("client_id", process.env.TWITCH_CLIENT_ID);
  url.searchParams.set("redirect_uri", process.env.TWITCH_REDIRECT_URI);
  url.searchParams.set("scope", "user:read:follows");
  url.searchParams.set("response_type", "token");

  return openUrl(url.href, undefined, true);
}

export async function validate() {
  const accessToken = await stores.accessToken.get();

  if (accessToken) {
    const response = await fetch("https://id.twitch.tv/oauth2/validate", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401) {
      createNotification("authorize", {
        title: t("notificationTitle_accessExpired"),
        message: t("notificationMessage_accessExpired"),
      });

      stores.accessToken.set(null);
    }

    return response.ok;
  }

  return false;
}

export async function revoke() {
  const token = await stores.accessToken.get();

  if (token) {
    fetch("https://id.twitch.tv/oauth2/revoke", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.TWITCH_CLIENT_ID,
        token,
      }),
    });
  }

  await stores.accessToken.set(null);
}

export async function filterNewStreams(streams: HelixStream[]) {
  const previousStreams = await stores.followedStreams.get();
  const settings = await stores.settings.get();

  const {
    notifications: { ignoredCategories, selectedUsers, withCategoryChanges, withFilters },
  } = settings;

  return streams.filter((stream) => {
    if (
      (withFilters && !selectedUsers.includes(stream.userId)) ||
      ignoredCategories.some((input) => matchString(stream.gameName, input))
    ) {
      return false;
    }

    const oldStream = find(previousStreams, {
      userId: stream.userId,
    });

    return oldStream == null || (withCategoryChanges && oldStream.gameId !== stream.gameId);
  });
}

export async function filterMutedStreams(streams: HelixStream[]) {
  const mutedUsers = await stores.mutedUsers.get();

  return streams.filter((stream) => {
    return !mutedUsers.includes(stream.userId);
  });
}
