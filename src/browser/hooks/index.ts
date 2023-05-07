import { chunk, flatMap, get, has, xor } from "lodash-es";
import { RefObject, useCallback, useEffect, useMemo, useState } from "react";
import { useHarmonicIntervalFn } from "react-use";
import useSWR, { SWRConfiguration } from "swr";
import useSWRInfinite, { SWRInfiniteConfiguration } from "swr/infinite";

import { ClickAction } from "~/common/constants";
import { allPromises, sendRuntimeMessage } from "~/common/helpers";
import { Store, stores } from "~/common/stores";
import {
  Dictionary,
  FollowedStreamSortField,
  FollowedStreamState,
  FollowedUserSortField,
  FollowedUserState,
  HelixCategorySearchResult,
  HelixChannelSearchResult,
  HelixClip,
  HelixFollowedChannel,
  HelixGame,
  HelixStream,
  HelixUser,
  HelixVideo,
  SortDirection,
} from "~/common/types";

export function useNow(interval = 1000): Date {
  const [now, setNow] = useState(new Date());

  useHarmonicIntervalFn(() => {
    setNow(new Date());
  }, interval);

  return now;
}

export interface UseStoreState<T> {
  isLoading: boolean;
  value: T;
}

export type UseStoreReturn<T> = [
  T,
  {
    isLoading: boolean;
    set(value: T): Promise<boolean>;
    set(updater: (value: T) => T): Promise<boolean>;
  }
];

export function useStore<T>(store: Store<T>): UseStoreReturn<T> {
  const [state, setState] = useState<UseStoreState<T>>({
    value: store.options.defaultValue,
    isLoading: true,
  });

  useEffect(() => {
    setState({
      value: store.options.defaultValue,
      isLoading: true,
    });

    const dispose = store.onChange((value) => {
      setState((state) => ({ ...state, value }));
    });

    store.get().then((value) => {
      setState({
        isLoading: false,
        value,
      });
    });

    return dispose;
  }, [store]);

  const set = store.set.bind(store);

  return [state.value, { ...state, set }];
}

export function useCurrentUser() {
  return useStore(stores.currentUser);
}

export function useFollowedStreams() {
  return useStore(stores.followedStreams);
}

export function useAccessToken() {
  return useStore(stores.accessToken);
}

export function useSettings() {
  return useStore(stores.settings);
}

export type UseFollowedStreamStateReturn = [
  FollowedStreamState,
  {
    setSortDirection(value: SortDirection): void;
    setSortField(value: FollowedStreamSortField): void;
  }
];

export function useFollowedStreamState(): UseFollowedStreamStateReturn {
  const [value, store] = useStore(stores.followedStreamState);

  return [
    value,
    {
      setSortDirection: (value) => store.set((state) => ({ ...state, sortDirection: value })),
      setSortField: (value) => store.set((state) => ({ ...state, sortField: value })),
    },
  ];
}

export type UseFollowedUserStateReturn = [
  FollowedUserState,
  {
    setSortDirection(value: SortDirection): void;
    setSortField(value: FollowedUserSortField): void;
    setStatus(value: boolean | null): void;
  }
];

export function useFollowedUserState(): UseFollowedUserStateReturn {
  const [value, store] = useStore(stores.followedUserState);

  return [
    value,
    {
      setSortDirection: (value) => store.set((state) => ({ ...state, sortDirection: value })),
      setSortField: (value) => store.set((state) => ({ ...state, sortField: value })),
      setStatus: (value) => store.set((state) => ({ ...state, status: value })),
    },
  ];
}

export type UsePinnedUsersReturn = [
  string[],
  {
    toggle(value: string): void;
  }
];

export function usePinnedUsers(): UsePinnedUsersReturn {
  const [state, store] = useStore(stores.pinnedUsers);

  return [
    state,
    {
      toggle: (value) => store.set((state) => xor(state, [value])),
    },
  ];
}

export type UsePinnedCategoriesReturn = [
  string[],
  {
    toggle(value: string): void;
  }
];

export function usePinnedCategories(): UsePinnedCategoriesReturn {
  const [state, store] = useStore(stores.pinnedCategories);

  return [
    state,
    {
      toggle: (value) => store.set((state) => xor(state, [value])),
    },
  ];
}

export function useClickAction(userLogin: string): string {
  const [settings] = useSettings();

  switch (settings.general.clickAction) {
    case ClickAction.Popout:
      return `https://twitch.tv/${userLogin}/popout`;

    case ClickAction.OpenChat:
      return `https://twitch.tv/${userLogin}/chat`;
  }

  return `https://twitch.tv/${userLogin}`;
}

export function useHover(ref: RefObject<Element>): boolean {
  const [value, setValue] = useState(false);

  const handleMouseEnter = useCallback(() => setValue(true), []);
  const handleMouseLeave = useCallback(() => setValue(false), []);

  useEffect(() => {
    const node = ref.current;

    if (node == null) {
      return;
    }

    node.addEventListener("mouseenter", handleMouseEnter);
    node.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      node.removeEventListener("mouseenter", handleMouseEnter);
      node.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref.current]);

  return value;
}

export interface UseQueryListResponse {
  fetchMore(): Promise<void>;
  refresh(): Promise<void>;
  hasMore: boolean;
  isLoading: boolean;
  isValidating: boolean;
  error?: Error;
}

export type UseQueryListReturn<T> = [T[] | undefined, UseQueryListResponse];

export function useQueryList<T = any>(
  path: string,
  params?: Dictionary<unknown> | null,
  config?: SWRInfiniteConfiguration
): UseQueryListReturn<T> {
  const { data, error, isLoading, isValidating, mutate, setSize, size } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (params == null) {
        return null;
      }

      if (pageIndex > 0) {
        const after = get(previousPageData, "pagination.cursor");

        if (after == null) {
          return null;
        }

        params = { ...params, after };
      }

      return [path, params];
    },
    {
      fetcher: (args) => sendRuntimeMessage("request", ...args),
      ...config,
    }
  );

  const page = get(data, size - 1);
  const hasMore = has(page, "pagination.cursor") || (size > 0 && isValidating);

  return [
    data?.flatMap((page) => page.data),
    {
      isLoading,
      isValidating,
      hasMore,
      error,

      async fetchMore() {
        await setSize((size) => size + 1);
      },

      async refresh() {
        await mutate();
      },
    },
  ];
}

export interface UseQueryDetailResponse {
  isLoading: boolean;
  error?: Error;
}

export type UseQueryDetailReturn<T> = [T | undefined, UseQueryDetailResponse];

export function useQueryDetail<T = any>(
  path: string,
  params?: Dictionary<unknown> | null,
  config?: SWRConfiguration
): UseQueryDetailReturn<T> {
  const { data, error, isLoading } = useSWR(params ? [path, params] : null, {
    fetcher: (args) => sendRuntimeMessage("request", ...args),
    ...config,
  });

  return [
    get(data, "data.0"),
    {
      isLoading,
      error,
    },
  ];
}

export function useClips(params?: any, config?: SWRInfiniteConfiguration) {
  return useQueryList<HelixClip>("clips", params, config);
}

export function useVideos(params?: any, config?: SWRInfiniteConfiguration) {
  return useQueryList<HelixVideo>("videos", params, config);
}

export function useStreams(params?: any, config?: SWRInfiniteConfiguration) {
  const [settings, { isLoading }] = useSettings();

  const queryParams = useMemo(() => {
    if (isLoading) {
      return null;
    }

    return {
      ...params,
      language: settings.streams.withFilters ? settings.streams.selectedLanguages : [],
      first: 100,
    };
  }, [isLoading, params, settings]);

  return useQueryList<HelixStream>("streams", queryParams, config);
}

export function useSearchChannels(params?: any, config?: SWRInfiniteConfiguration) {
  return useQueryList<HelixChannelSearchResult>("search/channels", params, config);
}

export function useSearchCategories(params?: any, config?: SWRInfiniteConfiguration) {
  return useQueryList<HelixCategorySearchResult>("search/categories", params, config);
}

export function useTopCategories(params?: any, config?: SWRInfiniteConfiguration) {
  return useQueryList<HelixGame>("games/top", params, config);
}

export function useCategories(params?: any, config?: SWRInfiniteConfiguration) {
  return useQueryList<HelixGame>("games", params, config);
}

export function useCategory(id?: number | string, config?: SWRConfiguration) {
  return useQueryDetail<HelixGame>("games", id ? { id } : null, config);
}

export function useFollowedChannels() {
  const [currentUser] = useCurrentUser();

  return useSWR(currentUser ? ["followedChannels", currentUser.id] : null, async () => {
    if (currentUser == null) {
      return [];
    }

    const fetchPage = async (after?: string) => {
      const { data, pagination } = await sendRuntimeMessage("request", "channels/followed", {
        userId: currentUser.id,
        first: 100,
        after,
      });

      if (pagination.cursor) {
        data.push(...(await fetchPage(pagination.cursor)));
      }

      return data as HelixFollowedChannel[];
    };

    return fetchPage();
  });
}

export function useUsersByID(id: string[]) {
  return useSWR(id.length > 0 ? ["usersByID", id] : null, async () => {
    const groups = chunk(id, 100);

    const promises = await allPromises(groups, async (id) => {
      const { data } = await sendRuntimeMessage("request", "users", {
        id,
      });

      return data as HelixUser[];
    });

    return flatMap(promises);
  });
}
