import { ClickAction, ClickBehavior } from "./constants";

export type Dictionary<T> = Record<string, T>;

export type FontSize = "smallest" | "small" | "medium" | "large" | "largest";
export type SortDirection = "asc" | "desc";
export type Theme = "system" | "dark" | "light";
export type CaseType = "default" | "title" | "lower" | "upper";

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
  titleCase: CaseType;
}

export interface NotificationSettings {
  enabled: boolean;
  withFilters: boolean;
  withCategoryChanges: boolean;
  ignoredCategories: string[];
  selectedUsers: string[];
}

export interface CustomAction {
  id: string;
  title: string;
  url: string;
}

export interface DropdownMenuSettings {
  customActions: CustomAction[];
}

export type FollowedStreamSortField = "gameName" | "startedAt" | "userLogin" | "viewerCount";

export interface FollowedStreamState {
  sortDirection: SortDirection;
  sortField: FollowedStreamSortField;
}

export type FollowedUserSortField = "followedAt" | "login";

export interface FollowedUserState {
  sortDirection: SortDirection;
  sortField: FollowedUserSortField;
  status: boolean | null;
}

export interface Settings {
  general: GeneralSettings;
  badge: BadgeSettings;
  notifications: NotificationSettings;
  dropdownMenu: DropdownMenuSettings;
  streams: StreamSettings;
}

export interface CurrentUser {
  id: string;
  login: string;
  displayName: string;
  profileImageUrl: string;
}

export type CollectionType = "category" | "user";

export interface Collection {
  id: string;
  name: string;
  type: CollectionType;
  open?: boolean;
  items: string[];
}

export interface HelixCategorySearchResult {
  boxArtUrl: string;
  id: string;
  name: string;
}

export interface HelixChannelSearchResult {
  broadcasterLogin: string;
  displayName: string;
  gameId: string;
  gameName: string;
  id: string;
  isLive: boolean;
  title: string;
  thumbnailUrl: string;
}

export interface HelixClip {
  id: string;
  url: string;
  embedUrl: string;
  broadcasterId: string;
  broadcasterName: string;
  creatorId: string;
  creatorName: string;
  videoId: string;
  gameId: string;
  language: string;
  title: string;
  viewCount: string;
  createdAt: string;
  thumbnailUrl: string;
  duration: number;
  vodOffset: number;
}

export interface HelixFollowedChannel {
  broadcasterId: string;
  broadcasterLogin: string;
  broadcasterName: string;
  followedAt: string;
}

export interface HelixGame {
  boxArtUrl: string;
  id: string;
  igdbId: string;
  name: string;
}

export interface HelixStream {
  id: string;
  userId: string;
  userLogin: string;
  userName: string;
  gameId: string;
  gameName: string;
  type: string;
  title: string;
  tags: null | string[];
  viewerCount: number;
  startedAt: string;
  language: string;
  thumbnailUrl: string;
  isMature: boolean;
}

export interface HelixUser {
  id: string;
  login: string;
  displayName: string;
  broadcasterType: string;
  description: string;
  profileImageUrl: string;
  offlineImageUrl: string;
  createdAt: string;
}

export interface HelixVideo {
  id: string;
  streamId: string;
  userId: string;
  userLogin: string;
  userName: string;
  title: string;
  description: string;
  createdAt: string;
  publishedAt: string;
  url: string;
  thumbnailUrl: string;
  viewable: string;
  viewCount: string;
  language: string;
  type: string;
  duration: string;
}

export interface HelixResponse<T> {
  data: Array<T>;

  pagination: {
    cursor?: string;
  };
}
