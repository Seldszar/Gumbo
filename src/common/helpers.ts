import { configureScope, init } from "@sentry/browser";
import browser from "webextension-polyfill";

export function setupErrorTracking() {
  init({
    dsn: process.env.SENTRY_DSN,
  });

  configureScope(async (scope) => {
    const [manifest, platformInfo] = await Promise.all([
      browser.runtime.getManifest(),
      browser.runtime.getPlatformInfo(),
    ]);

    scope.setContext("extension", {
      id: browser.runtime.id,
      version: manifest.version,
      platformInfo,
    });
  });
}
