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

export function getBaseFontSize(value: string): string {
  switch (value) {
    case "smallest":
      return "12px";

    case "small":
      return "13px";

    case "large":
      return "15px";

    case "largest":
      return "16px";
  }

  return "14px";
}
