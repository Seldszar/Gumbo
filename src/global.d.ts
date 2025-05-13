import { Browser } from "webextension-polyfill";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TWITCH_CLIENT_ID: string;
      TWITCH_REDIRECT_URI: string;

      SENTRY_DSN?: string;
    }
  }

  const browser: Browser;
}
