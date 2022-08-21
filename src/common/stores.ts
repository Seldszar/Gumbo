import {
  any,
  array,
  boolean,
  Describe,
  enums,
  mask,
  nullable,
  number,
  object,
  string,
} from "superstruct";
import { Storage } from "webextension-polyfill";

import { ClickAction, ClickBehavior } from "./constants";
import { FollowedStreamState, FollowedUserState, Settings } from "./types";

export type StoreAreaName = "local" | "managed" | "sync";
export type StoreMigration = (value: any) => Promise<any>;

export interface StoreOptions<T> {
  onChange?(newValue: T, oldValue?: T): void;
  migrations?: StoreMigration[];
  schema: Describe<T>;
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
    readonly options: StoreOptions<T>
  ) {}

  async setup(migrate = false): Promise<void> {
    if (migrate) {
      await this.migrate();
    }

    const value = await this.get();

    this.listeners.forEach((listener) => {
      listener(value);
    });
  }

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

  onChange(listener: StoreChange<T>): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  async getState(): Promise<StoreState<T>> {
    const state = {
      value: this.options.defaultValue,
      version: 1,
    };

    try {
      const { [this.name]: item } = await this.areaStorage.get(this.name);

      if (item) {
        state.value = this.validateValue(item.value);
      }
    } catch {} // eslint-disable-line no-empty

    return state;
  }

  async setState(state: StoreState<T>): Promise<void> {
    state.value = this.validateValue(state.value);

    await this.areaStorage.set({
      [this.name]: state,
    });
  }

  async get(): Promise<T> {
    return (await this.getState()).value;
  }

  async set(value: T): Promise<boolean>;
  async set(updater: (value: T) => T): Promise<boolean>;
  async set(value: any): Promise<boolean> {
    const state = await this.getState();

    if (typeof value === "function") {
      value = value(state.value);
    }

    if (state.value === value) {
      return false;
    }

    await this.setState({
      version: state.version,
      value,
    });

    return true;
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

      try {
        state.value = await migration(state.value);
      } catch {} // eslint-disable-line no-empty

      state.version = version;
    }

    await this.areaStorage.set({
      [this.name]: state,
    });
  }

  validateValue(value: T): T {
    return mask(value, this.options.schema);
  }
}

export const stores = {
  accessToken: new Store<string | null>("local", "accessToken", {
    schema: nullable(string()),
    defaultValue: null,
  }),
  currentUser: new Store<any>("local", "currentUser", {
    schema: nullable(object()),
    defaultValue: null,
  }),
  followedStreams: new Store<any[]>("local", "followedStreams", {
    schema: array(any()),
    defaultValue: [],
  }),
  followedUsers: new Store<any[]>("local", "followedUsers", {
    schema: array(any()),
    defaultValue: [],
  }),
  pinnedCategories: new Store<string[]>("local", "pinnedCategories", {
    schema: array(string()),
    defaultValue: [],
  }),
  pinnedUsers: new Store<string[]>("local", "pinnedUsers", {
    schema: array(string()),
    defaultValue: [],
  }),
  settings: new Store<Settings>("local", "settings", {
    schema: object({
      general: object({
        clickAction: number(),
        clickBehavior: number(),
        fontSize: enums(["smallest", "small", "medium", "large", "largest"]),
        theme: enums(["dark", "light"]),
      }),
      badge: object({
        enabled: boolean(),
        color: string(),
      }),
      channels: object({
        liveOnly: boolean(),
      }),
      notifications: object({
        enabled: boolean(),
        withFilters: boolean(),
        withCategoryChanges: boolean(),
        selectedUsers: array(any()),
      }),
      streams: object({
        withReruns: boolean(),
        withFilters: boolean(),
        selectedLanguages: array(any()),
      }),
    }),
    defaultValue: {
      general: {
        clickBehavior: ClickBehavior.CreateTab,
        clickAction: ClickAction.OpenChannel,
        fontSize: "medium",
        theme: "dark",
      },
      badge: {
        enabled: true,
        color: "#737373",
      },
      channels: {
        liveOnly: false,
      },
      notifications: {
        enabled: true,
        withFilters: false,
        withCategoryChanges: false,
        selectedUsers: [],
      },
      streams: {
        withReruns: true,
        withFilters: false,
        selectedLanguages: [],
      },
    },
  }),
  followedStreamState: new Store<FollowedStreamState>("local", "followedStreamState", {
    schema: object({
      sortDirection: enums(["asc", "desc"]),
      sortField: string(),
    }),
    defaultValue: {
      sortField: "viewer_count",
      sortDirection: "desc",
    },
  }),
  followedUserState: new Store<FollowedUserState>("local", "followedUserState", {
    schema: object({
      sortDirection: enums(["asc", "desc"]),
      sortField: string(),
      status: nullable(boolean()),
    }),
    defaultValue: {
      sortField: "login",
      sortDirection: "asc",
      status: null,
    },
  }),
};

browser.storage.onChanged.addListener((changes, areaName) => {
  for (const store of Object.values(stores)) {
    store.applyChange(changes, areaName);
  }
});
