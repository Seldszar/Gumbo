import { chunk, flatMap, get, has } from "lodash-es";
import { useMemo } from "react";
import useSWR, { Fetcher, SWRConfiguration } from "swr";
import useSWRInfinite, { SWRInfiniteConfiguration } from "swr/infinite";

import { sendRuntimeMessage } from "~/common/helpers";
import {
  HelixCategorySearchResult,
  HelixChannelSearchResult,
  HelixClip,
  HelixFollowedChannel,
  HelixGame,
  HelixStream,
  HelixUser,
  HelixVideo,
} from "~/common/types";

import { useCurrentUser, useSettings } from "./hooks";

export const backgroundFetcher: Fetcher<any, [string, any]> = ([url, params]) =>
  sendRuntimeMessage("request", url, params);

export interface UseQueryListResponse {
  fetchMore(): void;
  refresh(): void;
  isLoadingMore: boolean;
  hasMore: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  error?: Error;
}

export type UseQueryListReturn<T> = [T[] | undefined, UseQueryListResponse];

export function useQueryList<T = any>(
  path: string,
  params?: any,
  config?: SWRInfiniteConfiguration
): UseQueryListReturn<T> {
  const { data, error, isLoading, isValidating, mutate, setSize, size } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (params == null) {
        return null;
      }

      if (pageIndex > 0) {
        const cursor = get(previousPageData, "pagination.cursor");

        if (cursor == null) {
          return null;
        }

        return [path, { ...params, after: cursor }];
      }

      return [path, params];
    },
    config
  );

  const pageData = get(data, size - 1);
  const isRefreshing = isValidating && data?.length === size;
  const isLoadingMore = isLoading || (size > 0 && pageData == null);
  const hasMore = isLoading || isLoadingMore || has(pageData, "pagination.cursor");

  return [
    data?.flatMap((page) => page.data),
    {
      fetchMore: () => setSize((size) => size + 1),
      refresh: () => mutate(),
      isLoading,
      isLoadingMore,
      isRefreshing,
      hasMore,
      error,
    },
  ];
}

export interface UseQueryDetailResponse {
  isLoading: boolean;
  error?: Error;
}

export type UseQueryDetailReturn<T> = [T | undefined, UseQueryDetailResponse];

export function useQueryDetail<T = any>(
  url: string,
  params?: any,
  config?: SWRConfiguration
): UseQueryDetailReturn<T> {
  const { data, error, isLoading } = useSWR(params ? [url, params] : null, config);

  return [
    get(data, "data.0"),
    {
      isLoading,
      error,
    },
  ];
}

export function useClips(params?: any, config?: SWRInfiniteConfiguration) {
  return useQueryList<HelixClip>("clips", { ...params, first: 100 }, config);
}

export function useVideos(params?: any, config?: SWRInfiniteConfiguration) {
  return useQueryList<HelixVideo>("videos", { ...params, first: 100 }, config);
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
  const [settings, { isLoading }] = useSettings();

  const queryParams = useMemo(() => {
    if (isLoading || params == null) {
      return null;
    }

    return {
      ...params,
      liveOnly: settings.channels.liveOnly,
      first: 100,
    };
  }, [isLoading, params, settings]);

  return useQueryList<HelixChannelSearchResult>("search/channels", queryParams, config);
}

export function useSearchCategories(params?: any, config?: SWRInfiniteConfiguration) {
  const queryParams = useMemo(() => {
    if (params == null) {
      return null;
    }

    return {
      ...params,
      first: 100,
    };
  }, [params]);

  return useQueryList<HelixCategorySearchResult>("search/categories", queryParams, config);
}

export function useTopCategories(params?: any, config?: SWRInfiniteConfiguration) {
  return useQueryList<HelixGame>("games/top", { ...params, first: 100 }, config);
}

export function useCategories(params?: any, config?: SWRInfiniteConfiguration) {
  return useQueryList<HelixGame>("games", { ...params, first: 100 }, config);
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
      const { data, pagination } = await backgroundFetcher([
        "channels/followed",
        {
          userId: currentUser.id,
          first: 100,
          after,
        },
      ]);

      if (pagination.cursor) {
        data.push(...(await fetchPage(pagination.cursor)));
      }

      return data as HelixFollowedChannel[];
    };

    return fetchPage();
  });
}

export function useUsersByIds(userIds: string[]) {
  return useSWR(userIds.length > 0 ? ["usersByIds", userIds] : null, async () => {
    const groups = chunk(userIds, 100);

    const promises = await Promise.all(
      groups.map(async (id) => {
        const { data } = await backgroundFetcher([
          "users",
          {
            id,
          },
        ]);

        return data as HelixUser[];
      })
    );

    return flatMap(promises);
  });
}
