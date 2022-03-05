import { init } from "@sentry/browser";
import browser from "webextension-polyfill";

export function setupErrorTracking() {
  const manifest = browser.runtime.getManifest();

  init({
    dsn: process.env.SENTRY_DSN,
    denyUrls: [/static-cdn\.jtvnw\.net/],
    release: manifest.version,
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
