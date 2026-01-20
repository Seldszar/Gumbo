import { get } from "es-toolkit/compat";

import { caseString, openUrl } from "~/common/helpers";
import { stores } from "~/common/stores";
import type { HelixStream, HelixUser } from "~/common/types";

import { refreshActionBadge } from "./modules/badge";
import { backup, reset, restore } from "./modules/maintenance";
import { sendStreamNotifications } from "./modules/notification";
import {
  authorize,
  filterMutedStreams,
  filterNewStreams,
  getCurrentUser,
  getFollowedStreams,
  request,
  revoke,
  validate,
} from "./modules/twitch";

async function refresh(withNotifications: boolean) {
  browser.alarms.create("refresh", {
    periodInMinutes: 1,
  });

  if (navigator.onLine) {
    const settings = await stores.settings.get();

    let currentUser: HelixUser | null = null;
    let followedStreams = new Array<HelixStream>();

    if (await validate()) {
      currentUser = await getCurrentUser();

      if (currentUser) {
        followedStreams = await getFollowedStreams(currentUser.id);

        for (const stream of followedStreams) {
          stream.title = caseString(stream.title, settings.streams.titleCase);
        }
      }
    }

    const filteredStreams = await filterMutedStreams(followedStreams);

    if (withNotifications) {
      sendStreamNotifications(await filterNewStreams(filteredStreams));
    }

    refreshActionBadge(!!currentUser, filteredStreams.length);

    stores.currentUser.set(currentUser);
    stores.followedStreams.set(followedStreams);
  }
}

async function checkAlaram() {
  if (await browser.alarms.get("refresh")) {
    return;
  }

  refresh(false);
}

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
  }
});

browser.runtime.onInstalled.addListener(() => refresh(false));
browser.runtime.onStartup.addListener(() => refresh(false));

const messageHandlers = { authorize, backup, refresh, request, reset, restore, revoke };

browser.runtime.onMessage.addListener((message) => {
  const handler = get(messageHandlers, message.type);

  if (handler == null) {
    throw new RangeError("Message not found");
  }

  return handler(...message.args);
});

browser.tabs.onUpdated.addListener((_, changeInfo) => {
  if (!changeInfo.url?.startsWith(process.env.TWITCH_REDIRECT_URI)) {
    return;
  }

  const url = new URL(changeInfo.url);
  const hash = new URLSearchParams(url.hash.substring(1));

  stores.accessToken.set(hash.get("access_token"));
});

stores.accessToken.onChange(() => refresh(false));
stores.settings.onChange(() => refresh(false));

checkAlaram();
