import { ClickAction, ClickBehavior } from "./constants";

export type Dictionary<T> = Record<string, T>;

export type FontSize = "smallest" | "small" | "medium" | "large" | "largest";
export type SortDirection = "asc" | "desc";
export type Theme = "system" | "dark" | "light";

export interface GeneralSettings {
  clickBehavior: ClickBehavior;
  clickAction: ClickAction;
  fontSize: FontSize;
  theme: Theme;
}

export interface BadgeSettings {
  enabled: boolean;
  color: string;
}

export interface StreamSettings {
  withReruns: boolean;
  withFilters: boolean;
  selectedLanguages: string[];
}

export interface NotificationSettings {
  enabled: boolean;
  withFilters: boolean;
  withCategoryChanges: boolean;
  ignoredCategories: string[];
  selectedUsers: string[];
}

export interface ChannelSettings {
  liveOnly: boolean;
}

export interface FollowedStreamState {
  sortDirection: SortDirection;
  sortField: string;
}

export interface FollowedUserState {
  sortDirection: SortDirection;
  sortField: string;
  status: boolean | null;
}

export interface Settings {
  general: GeneralSettings;
  badge: BadgeSettings;
  channels: ChannelSettings;
  notifications: NotificationSettings;
  streams: StreamSettings;
}
