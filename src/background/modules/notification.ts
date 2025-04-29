import { find, map } from "lodash-es";

import { matchString, settlePromises, t } from "~/common/helpers";
import { stores } from "~/common/stores";
import { HelixStream } from "~/common/types";

import { getUsersByIds } from "./twitch";

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

export async function sendNotifications(newStreams: HelixStream[], oldStreams: HelixStream[]) {
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
