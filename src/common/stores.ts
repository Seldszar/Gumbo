import {
  array,
  boolean,
  defaulted,
  Describe,
  enums,
  mask,
  nullable,
  number,
  object,
  optional,
  string,
} from "superstruct";

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
    return chrome.storage[this.areaName];
  }

  constructor(
    readonly areaName: StoreAreaName,
    readonly name: string,
    readonly options: StoreOptions<T>,
  ) {}

  applyChange(changes: Record<string, chrome.storage.StorageChange>, areaName: string) {
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
        state.value = this.validateValue(item.value);
      }
    } catch {} // eslint-disable-line no-empty

    return state;
  }

  async setState(state: StoreState<T>) {
    state.value = this.validateValue(state.value);

    await this.areaStorage.set({
      [this.name]: state,
    });
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

  validateValue(value: T) {
    return mask(value, defaulted(this.options.schema, this.options.defaultValue));
  }
}

export const stores = {
  accessToken: new Store<string | null>("local", "accessToken", {
    schema: nullable(string()),
    defaultValue: null,
  }),
  currentUser: new Store<HelixUser | null>("session", "currentUser", {
    schema: nullable(
      object({
        id: string(),
        login: string(),
        displayName: string(),
        broadcasterType: string(),
        description: string(),
        profileImageUrl: string(),
        offlineImageUrl: string(),
        createdAt: string(),
      }),
    ),
    defaultValue: null,
  }),
  followedStreams: new Store<HelixStream[]>("session", "followedStreams", {
    schema: array(
      object({
        id: string(),
        userId: string(),
        userLogin: string(),
        userName: string(),
        gameId: string(),
        gameName: string(),
        type: string(),
        title: string(),
        tags: nullable(array(string())),
        viewerCount: number(),
        startedAt: string(),
        language: string(),
        thumbnailUrl: string(),
        isMature: boolean(),
      }),
    ),
    defaultValue: [],
  }),
  collections: new Store<Collection[]>("local", "collections", {
    schema: array(
      object({
        id: string(),
        name: string(),
        type: enums(["category", "user"]),
        open: optional(boolean()),
        items: array(string()),
      }),
    ),
    defaultValue: [],
  }),
  settings: new Store<Settings>("local", "settings", {
    schema: object({
      general: object({
        clickAction: number(),
        clickBehavior: number(),
        fontSize: enums(["smallest", "small", "medium", "large", "largest"]),
        theme: enums(["system", "dark", "light"]),
      }),
      badge: object({
        enabled: boolean(),
        color: string(),
      }),
      dropdownMenu: object({
        customActions: array(
          object({
            id: string(),
            title: string(),
            url: string(),
          }),
        ),
      }),
      notifications: object({
        enabled: boolean(),
        withFilters: boolean(),
        withCategoryChanges: boolean(),
        ignoredCategories: array(string()),
        selectedUsers: array(string()),
      }),
      streams: object({
        withReruns: boolean(),
        withFilters: boolean(),
        selectedLanguages: array(string()),
      }),
    }),
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
      },
    },
  }),
  followedStreamState: new Store<FollowedStreamState>("local", "followedStreamState", {
    schema: object({
      sortDirection: enums(["asc", "desc"]),
      sortField: enums(["gameName", "startedAt", "userLogin", "viewerCount"]),
    }),
    defaultValue: {
      sortField: "viewerCount",
      sortDirection: "desc",
    },
  }),
  followedUserState: new Store<FollowedUserState>("local", "followedUserState", {
    schema: object({
      sortDirection: enums(["asc", "desc"]),
      sortField: enums(["followedAt", "login"]),
      status: nullable(boolean()),
    }),
    defaultValue: {
      sortField: "login",
      sortDirection: "asc",
      status: null,
    },
  }),
  mutedUsers: new Store<string[]>("local", "mutedUsers", {
    schema: array(string()),
    defaultValue: [],
  }),
};

chrome.storage.onChanged.addListener((changes, areaName) => {
  for (const store of Object.values(stores)) {
    store.applyChange(changes, areaName);
  }
});
