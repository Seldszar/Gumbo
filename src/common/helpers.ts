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

export async function readAsDataURL(blob: Blob): Promise<string> {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.addEventListener("error", reject);
    reader.addEventListener("load", () => {
      resolve(reader.result as string);
    });

    reader.readAsDataURL(blob);
  });
}
