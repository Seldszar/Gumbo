import { camelCase, castArray, chunk, flatMap, get, snakeCase, toString } from "lodash-es";

import { AUTHORIZE_URL } from "~/common/constants";
import { allPromises, changeCase, openUrl, t } from "~/common/helpers";
import { stores } from "~/common/stores";
import { Dictionary, HelixResponse, HelixStream, HelixUser } from "~/common/types";

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
    headers: [["Client-ID", process.env.TWITCH_CLIENT_ID as string]],
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

export async function getCurrentUser() {
  return get(await request<HelixUser>("users"), "data.0", null);
}

export async function getUsersByIds(userIds: string[]) {
  const pages = await allPromises(chunk(userIds, 100), async (id) =>
    get(await request<HelixUser>("users", { id }), "data"),
  );

  return flatMap(pages);
}

export async function getFollowedStreams(userId: string) {
  const followedStreams = await paginate<HelixStream>("streams/followed", {
    first: 100,
    userId,
  });

  return followedStreams;
}

export async function authorize() {
  return openUrl(AUTHORIZE_URL, undefined, true);
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
        client_id: process.env.TWITCH_CLIENT_ID as string,
        token,
      }),
    });
  }

  await stores.accessToken.reset();
}
