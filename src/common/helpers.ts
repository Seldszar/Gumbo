import { init } from "@sentry/browser";
import { isPlainObject, lowerCase, reduce } from "lodash-es";
import { MouseEvent } from "react";

import { ClickBehavior } from "./constants";
import { stores } from "./stores";
import { Dictionary, FontSize, HelixStream } from "./types";

export const t = browser.i18n.getMessage;

export function setupSentry() {
  const manifest = browser.runtime.getManifest();

  init({
    dsn: process.env.SENTRY_DSN as string,
    release: manifest.version,
  });
}

export function getBaseFontSize(value: FontSize): string {
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

export function sendRuntimeMessage(type: string, ...args: any[]): Promise<any> {
  return browser.runtime.sendMessage({ type, args });
}

export function allPromises<T, V>(values: Iterable<T>, iteratee: (value: T) => Promise<V>) {
  return Promise.all(Array.from(values, iteratee));
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

export function changeCase(input: any, mapper: (key: string) => string): any {
  if (Array.isArray(input)) {
    return input.map((value) => changeCase(value, mapper));
  }

  if (isPlainObject(input)) {
    const result: any = {};

    for (const [name, value] of Object.entries(input)) {
      result[mapper(name)] = changeCase(value, mapper);
    }

    return result;
  }

  return input;
}

export function isRerunStream(stream?: HelixStream): boolean {
  return stream?.tags?.includes("Rerun") ?? false;
}
