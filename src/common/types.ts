export type Dictionary<T> = Record<string, T>;

export interface StreamSettings {
  withReruns: boolean;
  withFilters: boolean;
  selectedLanguages: string[];
}

export interface NotificationSettings {
  enabled: boolean;
  withFilters: boolean;
  selectedUsers: string[];
}

export interface ChannelSettings {
  liveOnly: boolean;
}

export interface FollowedStreamState {
  sortDirection: "asc" | "desc";
  sortField: string;
}

export interface Settings {
  channels: ChannelSettings;
  notifications: NotificationSettings;
  streams: StreamSettings;
}
