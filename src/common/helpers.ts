import { init } from "@sentry/browser";
import { lowerCase, reduce } from "lodash-es";
import { MouseEvent } from "react";

import { ClickBehavior } from "./constants";
import { stores } from "./stores";
import { Dictionary } from "./types";

export const t = browser.i18n.getMessage;

export function setupSentry() {
  const manifest = browser.runtime.getManifest();

  init({
    dsn: process.env.SENTRY_DSN,
    release: manifest.version,
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

export async function openUrl(url: string, event?: MouseEvent, shiftKey = false): Promise<void> {
  event?.stopPropagation();
  event?.preventDefault();

  const settings = await stores.settings.get();

  let {
    general: { clickBehavior },
  } = settings;

  let active = true;

  if (event) {
    if (event.button > 1) {
      return;
    }

    if (event.ctrlKey || event.button > 0) {
      active = false;

      if (clickBehavior === ClickBehavior.CreateCurrentTab) {
        clickBehavior = ClickBehavior.CreateTab;
      }
    }

    if (event.shiftKey) {
      shiftKey = true;
    }
  }

  if (shiftKey) {
    clickBehavior =
      ClickBehavior[clickBehavior === ClickBehavior.CreateWindow ? "CreateTab" : "CreateWindow"];
  }

  switch (clickBehavior) {
    case ClickBehavior.CreateTab: {
      browser.tabs.create({
        active,
        url,
      });

      break;
    }

    case ClickBehavior.CreateWindow: {
      browser.windows.create({
        url,
      });

      break;
    }

    case ClickBehavior.CreateCurrentTab: {
      browser.tabs.update(undefined, {
        active,
        url,
      });

      break;
    }
  }

  if (active && typeof window === "object") {
    window.close();
  }
}

export function template(input: string, data: Dictionary<unknown>) {
  return reduce(data, (result, value, key) => result.replace(key, String(value)), input);
}

export function sendRuntimeMessage<T extends unknown[], V>(type: string, ...args: T): Promise<V> {
  return browser.runtime.sendMessage({ type, args });
}

export function settlePromises<T, V>(values: Iterable<T>, iteratee: (value: T) => Promise<V>) {
  return Promise.allSettled(Array.from(values, iteratee));
}

export function tokenify(input: string): string {
  return lowerCase(input.toLowerCase());
}

export function matchString(input: string, searchString: string): boolean {
  return tokenify(input).includes(tokenify(searchString));
}
