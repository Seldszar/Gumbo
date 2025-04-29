import { stores } from "~/common/stores";

export async function refreshActionBadge(count: number) {
  const currentUser = await stores.currentUser.get();
  const settings = await stores.settings.get();

  let text = "";

  if (settings.badge.enabled && count > 0) {
    text = count.toLocaleString("en-US");
  }

  const getIconPath = (size: number) =>
    browser.runtime.getURL(currentUser ? `icon-${size}.png` : `icon-gray-${size}.png`);

  browser.action.setBadgeBackgroundColor({
    color: settings.badge.color,
  });

  browser.action.setBadgeText({
    text,
  });

  browser.action.setIcon({
    path: {
      16: getIconPath(16),
      32: getIconPath(32),
    },
  });
}
