import { get, has } from "lodash-es";
import { useEffect, useState } from "react";
import useSWR, { Fetcher, Middleware } from "swr";
import useSWRInfinite from "swr/infinite";

import { sendRuntimeMessage } from "~/common/helpers";

import { useSettings } from "./hooks";

export const onceMiddleware: Middleware = (useSWRNext) => (key, fetcher, config) => {
  const [data, setData] = useState<any>();

  const swr = useSWRNext(data ? null : key, fetcher, config);

  useEffect(() => {
    if (swr.data === undefined) {
      return;
    }

    setData(swr.data);
  }, [swr.data]);

  return {
    ...swr,
    data,
    mutate(data) {
      setData(undefined);

      return swr.mutate(data);
    },
  };
};

export const backgroundFetcher: Fetcher<any, [string, any]> = (url, params = {}) =>
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

export function useQueryList(url: string, params?: any, config?: any): UseQueryListReturn<any> {
  const { data, error, isValidating, mutate, setSize, size } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (params == null) {
        return null;
      }

      if (pageIndex > 0) {
        const cursor = get(previousPageData, "pagination.cursor");

        if (cursor == null) {
          return null;
        }

        return [url, { ...params, after: cursor }];
      }

      return [url, params];
    },
    config
  );

  const pageData = get(data, size - 1);
  const isLoading = data == null && error == null;
  const isLoadingMore = isLoading || (size > 0 && pageData == null);
  const isRefreshing = isValidating && data?.length === size;
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

export function useQueryDetail(url: string, params?: any, config?: any): UseQueryDetailReturn<any> {
  const { data, error } = useSWR(params ? [url, params] : null, config);

  const isLoading = data == null && error == null;

  return [
    get(data, "data.0"),
    {
      isLoading,
      error,
    },
  ];
}

export function useClips(params: any = {}): UseQueryListReturn<any> {
  return useQueryList("clips", {
    ...params,
    first: 100,
  });
}

export function useVideos(params: any = {}): UseQueryListReturn<any> {
  return useQueryList("videos", {
    ...params,
    first: 100,
  });
}

export function useStreams(params: any = {}): UseQueryListReturn<any> {
  const [settings, { isLoading }] = useSettings();

  return useQueryList(
    "streams",
    isLoading
      ? null
      : {
          ...params,
          language: settings.streams.withFilters ? settings.streams.selectedLanguages : [],
          first: 100,
        }
  );
}

export function useSearchChannels(params: any = {}): UseQueryListReturn<any> {
  const [settings, { isLoading }] = useSettings();

  return useQueryList(
    "search/channels",
    isLoading
      ? null
      : {
          ...params,
          live_only: settings.channels.liveOnly,
          first: 100,
        }
  );
}

export function useSearchCategories(params: any = {}): UseQueryListReturn<any> {
  return useQueryList("search/categories", { ...params, first: 100 });
}

export function useTopCategories(): UseQueryListReturn<any> {
  return useQueryList("games/top", {
    first: 100,
  });
}

export function useCategories(params?: any, config?: any): UseQueryListReturn<any> {
  return useQueryList("games", { ...params, first: 100 }, config);
}

export function useCategory(id?: number | string): UseQueryDetailReturn<any> {
  return useQueryDetail("games", { id });
}
