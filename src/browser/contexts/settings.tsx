import { get, set } from "lodash-es";
import { ReactNode, createContext, useContext } from "react";

import { Settings } from "~/common/types";

import { useSettings } from "../hooks";

export interface SettingsContext {
  register(name: string): any;
  settings: Settings;
}

const Context = createContext<any>(null);

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider(props: SettingsProviderProps) {
  const [settings, store] = useSettings();

  const register = (path: string) => ({
    value: get(settings, path),
    onChange(value: unknown) {
      store.set(set(settings, path, value));
    },
  });

  return <Context.Provider value={{ register, settings }}>{props.children}</Context.Provider>;
}

export function useSettingsContext(): SettingsContext {
  return useContext(Context);
}
