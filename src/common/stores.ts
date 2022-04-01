import { defaultsDeep } from "lodash-es";
import browser, { Storage } from "webextension-polyfill";

import { FollowedStreamState, FollowedUserState, Settings } from "./types";

export type StoreAreaName = "local" | "managed" | "sync";
export type StoreMigration = (value: any) => Promise<any>;

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

  async setState(state: StoreState<T>): Promise<void> {
    await this.areaStorage.set({
      [this.name]: state,
    });
  }

  async get(): Promise<T> {
    return (await this.getState()).value;
  }

  async set(value: T): Promise<void>;
  async set(updater: (value: T) => T): Promise<void>;
  async set(value: any): Promise<void> {
    const state = await this.getState();

    if (typeof value === "function") {
      value = value(state.value);
    }

    await this.setState({
      version: state.version,
      value,
    });
  }

  async restore(state: StoreState<T>): Promise<void> {
    await this.setState(state);
    await this.migrate();
  }

  async migrate(): Promise<void> {
    const state = await this.getState();

    const {
      options: { migrations = [] },
    } = this;

    for (const [index, migration] of migrations.entries()) {
      const version = index + 2;

      if (state.version >= version) {
        break;
      }

      state.value = await migration(state.value);
      state.version = version;
    }

    defaultsDeep(state.value, this.options.defaultValue);

    await this.areaStorage.set({
      [this.name]: state,
    });
  }
}

export const stores = {
  accessToken: new Store<string | null>("local", "accessToken", {
    defaultValue: null,
    migrations: [
      (value) => {
        const store = new Store("sync", "accessToken", {
          defaultValue: value,
        });

        return store.get();
      },
    ],
  }),
  currentUser: new Store<any>("local", "currentUser", {
    defaultValue: null,
  }),
  isRefreshing: new Store<boolean>("local", "isRefreshing", {
    defaultValue: false,
  }),
  followedStreams: new Store<any[]>("local", "followedStreams", {
    defaultValue: [],
  }),
  followedUsers: new Store<any[]>("local", "followedUsers", {
    defaultValue: [],
  }),
  pinnedUsers: new Store<string[]>("local", "pinnedUsers", {
    defaultValue: [],
    migrations: [
      (value) => {
        const store = new Store("sync", "pinnedUsers", {
          defaultValue: value,
        });

        return store.get();
      },
    ],
  }),
  settings: new Store<Settings>("local", "settings", {
    defaultValue: {
      general: {
        fontSize: "medium",
        theme: "dark",
      },
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
    migrations: [
      (value) => {
        const store = new Store("sync", "settings", {
          defaultValue: value,
        });

        return store.get();
      },
    ],
  }),
  followedStreamState: new Store<FollowedStreamState>("local", "followedStreamState", {
    defaultValue: {
      sortField: "viewer_count",
      sortDirection: "desc",
    },
    migrations: [
      (value) => {
        const store = new Store("sync", "followedStreamState", {
          defaultValue: value,
        });

        return store.get();
      },
    ],
  }),
  followedUserState: new Store<FollowedUserState>("local", "followedUserState", {
    defaultValue: {
      sortField: "login",
      sortDirection: "asc",
      status: null,
    },
    migrations: [
      (value) => {
        const store = new Store("sync", "followedUserState", {
          defaultValue: value,
        });

        return store.get();
      },
    ],
  }),
};
