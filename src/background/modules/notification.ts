import { t } from "~/common/helpers";
import { stores } from "~/common/stores";
import { HelixStream } from "~/common/types";

import { getUsersByIds } from "./twitch";

export interface CreateNotificationOptions {
  iconUrl?: string;

  title: string;
  message: string;
}

export function createNotification(notificationId: string, options: CreateNotificationOptions) {
  return browser.notifications.create(`${Date.now()}:${notificationId}`, {
    iconUrl: browser.runtime.getURL("icon-96.png"),
    type: "basic",

    ...options,
  });
}

async function sendStreamNotification(stream: HelixStream, iconUrl?: string) {
  return createNotification(`stream:${stream.userLogin}`, {
    iconUrl,

    message: stream.title || t("detailText_noTitle"),
    title: t(`notificationMessage_stream${stream.gameName ? "Playing" : "Online"}`, [
      stream.userName || stream.userLogin,
      stream.gameName,
    ]),
  });
}

export async function sendStreamNotifications(streams: HelixStream[]) {
  const settings = await stores.settings.get();

  if (settings.notifications.enabled) {
    const users = await getUsersByIds(streams.map((stream) => stream.userId));

    streams.forEach((stream) => {
      const user = users.find((user) => user.id === stream.userId);

      sendStreamNotification(stream, user?.profileImageUrl);
    });
  }
}
