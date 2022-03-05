import { defaultsDeep } from "lodash-es";
import browser, { Storage } from "webextension-polyfill";

import { Settings } from "./types";

export type StoreAreaName = "local" | "managed" | "sync";

export interface StoreMigration {
  migrate(value: any): any;
  version: number;
}

export interface StoreOptions<T> {
  migrations?: StoreMigration[];
  defaultValue: T;
}

export interface StoreState<T> {
  version: number;
  value: T;
}

export type StoreChange<T> = (newValue: T, oldValue?: T) => void;

export class Store<T> {
  private get areaStorage() {
    return browser.storage[this.areaName];
  }

  constructor(
    readonly areaName: StoreAreaName,
    readonly name: string,
    readonly options: StoreOptions<T>
  ) {}

  onChange(callback: StoreChange<T>): () => void {
    const listener = (changes: Record<string, Storage.StorageChange>, areaName: string) => {
      if (areaName !== this.areaName) {
        return;
      }

      const { [this.name]: change } = changes;

      if (change == null) {
        return;
      }

      callback(change.newValue.value, change.oldValue.value);
    };

    browser.storage.onChanged.addListener(listener);

    return () => {
      browser.storage.onChanged.removeListener(listener);
    };
  }

  async getState(): Promise<StoreState<T>> {
    const items = await this.areaStorage.get(this.name);

    return (
      items[this.name] ?? {
        value: this.options.defaultValue,
        version: 1,
      }
    );
  }

  async get(): Promise<T> {
    return (await this.getState()).value;
  }

  async set(value: T): Promise<void>;
  async set(updater: (value: T) => T): Promise<void>;
  async set(value: unknown): Promise<void> {
    const state = await this.getState();

    if (typeof value === "function") {
      value = value(state.value);
    }

    await this.areaStorage.set({
      [this.name]: {
        version: state.version,
        value,
      },
    });
  }

  async migrate(): Promise<void> {
    const state = await this.getState();

    for (const migration of this.options.migrations ?? []) {
      if (state.version >= migration.version) {
        break;
      }

      state.value = migration.migrate(state.value);
      state.version = migration.version;
    }

    defaultsDeep(state.value, this.options.defaultValue);

    await this.areaStorage.set({
      [this.name]: state,
    });
  }
}

export const stores = {
  accessToken: new Store<any>("sync", "accessToken", {
    defaultValue: null,
  }),
  currentUser: new Store<any>("local", "currentUser", {
    defaultValue: null,
  }),
  followedStreams: new Store<any[]>("local", "followedStreams", {
    defaultValue: [],
  }),
  followedUsers: new Store<any[]>("local", "followedUsers", {
    defaultValue: [],
  }),
  settings: new Store<Settings>("sync", "settings", {
    defaultValue: {
      channels: {
        liveOnly: false,
      },
      notifications: {
        enabled: true,
        withFilters: false,
        selectedUsers: [],
      },
      streams: {
        withReruns: true,
        withFilters: false,
        selectedLanguages: [],
      },
    },
  }),
};
