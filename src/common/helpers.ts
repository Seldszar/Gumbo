import { init } from "@sentry/browser";
import browser from "webextension-polyfill";

export function setupErrorTracking() {
  const manifest = browser.runtime.getManifest();

  init({
    dsn: process.env.SENTRY_DSN,
    release: manifest.version,
    ignoreErrors: [
      /^AbortError:/i,
      /^Corruption:/i,
      /^InvalidStateError:/i,
      /^IO error:/i,
      /^QuotaExceededError:/i,
    ],
  });
}
