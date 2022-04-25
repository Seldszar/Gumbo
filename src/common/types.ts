import { ClickAction, ClickBehavior } from "./constants";

export type Dictionary<T> = Record<string, T>;

export type FontSize = "smallest" | "small" | "medium" | "large" | "largest";
export type SortDirection = "asc" | "desc";
export type Theme = "dark" | "light";

export interface GeneralSettings {
  clickBehavior: ClickBehavior;
  clickAction: ClickAction;
  fontSize: FontSize;
  theme: Theme;
  withBadge: boolean;
}

export interface StreamSettings {
  withReruns: boolean;
  withFilters: boolean;
  selectedLanguages: string[];
}

export interface NotificationSettings {
  enabled: boolean;
  gameChangeEnabled: boolean;
  withFilters: boolean;
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
  channels: ChannelSettings;
  notifications: NotificationSettings;
  streams: StreamSettings;
}
