import { init } from "@sentry/browser";
import browser from "webextension-polyfill";

export async function setupErrorTracking() {
  const [browserInfo, platformInfo] = await Promise.all([
    browser.runtime.getBrowserInfo(),
    browser.runtime.getPlatformInfo(),
  ]);

  init({
    dsn: process.env.SENTRY_DSN,
    initialScope: {
      contexts: {
        extension: {
          id: browser.runtime.id,
          browserInfo,
          platformInfo,
        },
      },
    },
  });
}
