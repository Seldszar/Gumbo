import { RefObject, useCallback, useEffect, useState } from "react";

import { ClickAction } from "~/common/constants";

import { UseStoreOptions, useSettings } from "./store";

export function useClickAction(userLogin: string, options?: UseStoreOptions): string {
  const [settings] = useSettings(options);

  switch (settings.general.clickAction) {
    case ClickAction.Popout:
      return `https://twitch.tv/${userLogin}/popout`;

    case ClickAction.OpenChat:
      return `https://twitch.tv/${userLogin}/chat`;
  }

  return `https://twitch.tv/${userLogin}`;
}

export function useHover(ref: RefObject<Element>): boolean {
  const [value, setValue] = useState(false);

  const handleMouseEnter = useCallback(() => setValue(true), []);
  const handleMouseLeave = useCallback(() => setValue(false), []);

  useEffect(() => {
    const node = ref.current;

    if (node == null) {
      return;
    }

    node.addEventListener("mouseenter", handleMouseEnter);
    node.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      node.removeEventListener("mouseenter", handleMouseEnter);
      node.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref.current]);

  return value;
}

const mediaQueryList = matchMedia("(prefers-color-scheme: dark)");

export function usePreferDarkMode() {
  const [darkMode, setDarkMode] = useState(mediaQueryList.matches);

  useEffect(() => {
    const listener = (event: MediaQueryListEvent) => {
      setDarkMode(event.matches);
    };

    mediaQueryList.addEventListener("change", listener);

    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, []);

  return darkMode;
}
