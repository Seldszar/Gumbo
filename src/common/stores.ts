import { defaultsDeep, isObject } from "es-toolkit/compat";
import { Storage } from "webextension-polyfill";

import { ClickAction, ClickBehavior } from "./constants";
import {
  Collection,
  FollowedStreamState,
  FollowedUserState,
  HelixStream,
  HelixUser,
  Settings,
} from "./types";

export type StoreAreaName = "local" | "session" | "sync";

export interface StoreOptions<T> {
  defaultValue: T;
}

export interface StoreState<T> {
  version: number;
  value: T;
}

export type StoreChange<T> = (newValue: T, oldValue?: T) => void;

export class Store<T> {
  private listeners = new Set<StoreChange<T>>();

  private get areaStorage() {
    return browser.storage[this.areaName];
  }

  constructor(
    readonly areaName: StoreAreaName,
    readonly name: string,
    readonly options: StoreOptions<T>,
  ) {}

  applyChange(changes: Record<string, Storage.StorageChange>, areaName: string) {
    if (areaName !== this.areaName) {
      return;
    }

    const { [this.name]: change } = changes;

    if (change?.newValue == null) {
      return;
    }

    this.listeners.forEach((listener) => {
      listener(change.newValue?.value, change.oldValue?.value);
    });
  }

  onChange(listener: StoreChange<T>) {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  async getState() {
    const state: StoreState<T> = {
      value: this.options.defaultValue,
      version: 1,
    };

    try {
      const { [this.name]: item } = await this.areaStorage.get(this.name);

      if (item) {
        state.value = isObject(item.value)
          ? defaultsDeep(item.value, this.options.defaultValue)
          : item.value;
      }
    } catch {} // eslint-disable-line no-empty

    return state;
  }

  async setState(state: StoreState<T>) {
    await this.areaStorage.set({ [this.name]: state });
  }

  async get() {
    return (await this.getState()).value;
  }

  async set(value: T): Promise<void>;
  async set(updater: (value: T) => T): Promise<void>;
  async set(value: any) {
    const state = await this.getState();

    if (typeof value === "function") {
      value = value(state.value);
    }

    await this.setState({
      version: state.version,
      value,
    });
  }

  async reset() {
    await this.set(this.options.defaultValue);
  }

  async restore(state: StoreState<T>) {
    await this.setState(state);
  }
}

export const stores = {
  accessToken: new Store<string | null>("local", "accessToken", {
    defaultValue: null,
  }),
  currentUser: new Store<HelixUser | null>("session", "currentUser", {
    defaultValue: null,
  }),
  followedStreams: new Store<HelixStream[]>("session", "followedStreams", {
    defaultValue: [],
  }),
  collections: new Store<Collection[]>("local", "collections", {
    defaultValue: [],
  }),
  settings: new Store<Settings>("local", "settings", {
    defaultValue: {
      general: {
        clickBehavior: ClickBehavior.CreateTab,
        clickAction: ClickAction.OpenChannel,
        fontSize: "medium",
        theme: "system",
      },
      badge: {
        enabled: true,
        color: "#737373",
      },
      dropdownMenu: {
        customActions: [],
      },
      notifications: {
        enabled: true,
        withFilters: false,
        withCategoryChanges: false,
        ignoredCategories: [],
        selectedUsers: [],
      },
      streams: {
        withReruns: true,
        withFilters: false,
        selectedLanguages: [],
        titleCase: "default",
      },
    },
  }),
  followedStreamState: new Store<FollowedStreamState>("local", "followedStreamState", {
    defaultValue: {
      sortField: "viewerCount",
      sortDirection: "desc",
    },
  }),
  followedUserState: new Store<FollowedUserState>("local", "followedUserState", {
    defaultValue: {
      sortField: "login",
      sortDirection: "asc",
      status: null,
    },
  }),
  mutedUsers: new Store<string[]>("local", "mutedUsers", {
    defaultValue: [],
  }),
};

browser.storage.onChanged.addListener((changes, areaName) => {
  for (const store of Object.values(stores)) {
    store.applyChange(changes, areaName);
  }
});
