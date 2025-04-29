import { openUrl, setupSentry } from "~/common/helpers";
import { stores } from "~/common/stores";
import { HelixStream, HelixUser } from "~/common/types";

import { refreshActionBadge } from "./modules/badge";
import { sendNotifications } from "./modules/notification";
import { authorize, getCurrentUser, getFollowedStreams } from "./modules/twitch";

setupSentry();

async function refresh() {
  let currentUser: HelixUser | null = null;
  let followedStreams = new Array<HelixStream>();

  try {
    const accessToken = await stores.accessToken.get();

    if (accessToken) {
      currentUser = await getCurrentUser();

      if (currentUser) {
        followedStreams = await getFollowedStreams(currentUser.id);
      }
    }

    await stores.currentUser.set(currentUser);
    await stores.followedStreams.set(followedStreams);
  } catch {} // eslint-disable-line no-empty

  browser.alarms.clearAll();
  browser.alarms.create("refresh", {
    periodInMinutes: 1,
  });
}

browser.alarms.onAlarm.addListener(refresh);

browser.runtime.onInstalled.addListener(refresh);
browser.runtime.onStartup.addListener(refresh);

browser.notifications.onClicked.addListener((notificationId) => {
  const [, type, data] = notificationId.split(":");

  switch (type) {
    case "authorize":
      return authorize();

    case "stream":
      return openUrl(`https://twitch.tv/${data}`);
  }
});

stores.accessToken.onChange(refresh);
stores.settings.onChange(refresh);

stores.followedStreams.onChange((newValue, oldValue) => {
  if (oldValue) {
    sendNotifications(newValue, oldValue);
  }

  refreshActionBadge(newValue.length);
});
