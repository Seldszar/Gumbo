export type Dictionary<T> = Record<string, T>;

export interface StreamSettings {
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

export interface Settings {
  channels: ChannelSettings;
  notifications: NotificationSettings;
  streams: StreamSettings;
}
