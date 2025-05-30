import { chunk, flatten, get, has } from "es-toolkit/compat";
import { useMemo } from "react";
import useSWR, { SWRConfiguration } from "swr";
import useSWRInfinite, { SWRInfiniteConfiguration } from "swr/infinite";

import { allPromises, sendRuntimeMessage } from "~/common/helpers";
import {
  Dictionary,
  HelixCategorySearchResult,
  HelixChannelSearchResult,
  HelixClip,
  HelixFollowedChannel,
  HelixGame,
  HelixResponse,
  HelixStream,
  HelixUser,
  HelixVideo,
} from "~/common/types";

import { UseStoreOptions, useCurrentUser, useSettings } from "./store";

export interface UseQueryListResponse {
  fetchMore(): Promise<void>;
  refresh(): Promise<void>;
  hasMore: boolean;
  isLoading: boolean;
  isValidating: boolean;
  error?: Error;
}

export type UseQueryListReturn<T> = [HelixResponse<T>[] | undefined, UseQueryListResponse];

export function useQueryList<T = any>(
  path: string,
  params?: Dictionary<unknown> | null,
  config?: SWRInfiniteConfiguration,
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
    },
  );

  const page = get(data, size - 1);
  const hasMore = has(page, "pagination.cursor") || (size > 0 && isValidating);

  return [
    data,
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
  config?: SWRConfiguration,
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

export function useClips(params?: Dictionary<unknown> | null, config?: SWRInfiniteConfiguration) {
  return useQueryList<HelixClip>("clips", params, config);
}

export function useVideos(params?: Dictionary<unknown> | null, config?: SWRInfiniteConfiguration) {
  return useQueryList<HelixVideo>("videos", params, config);
}

export function useStreams(params?: Dictionary<unknown> | null, config?: SWRInfiniteConfiguration) {
  const [settings, { isLoading }] = useSettings(config);

  const queryParams = useMemo(() => {
    if (isLoading) {
      return null;
    }

    let language;

    if (settings.streams.withFilters) {
      language = settings.streams.selectedLanguages;
    }

    return { ...params, language };
  }, [isLoading, params, settings]);

  return useQueryList<HelixStream>("streams", queryParams, config);
}

export function useSearchChannels(
  params?: Dictionary<unknown> | null,
  config?: SWRInfiniteConfiguration,
) {
  return useQueryList<HelixChannelSearchResult>("search/channels", params, config);
}

export function useSearchCategories(
  params?: Dictionary<unknown> | null,
  config?: SWRInfiniteConfiguration,
) {
  return useQueryList<HelixCategorySearchResult>("search/categories", params, config);
}

export function useTopCategories(
  params?: Dictionary<unknown> | null,
  config?: SWRInfiniteConfiguration,
) {
  return useQueryList<HelixGame>("games/top", params, config);
}

export function useCategories(
  params?: Dictionary<unknown> | null,
  config?: SWRInfiniteConfiguration,
) {
  return useQueryList<HelixGame>("games", params, config);
}

export function useCategory(id?: number | string, config?: SWRConfiguration) {
  return useQueryDetail<HelixGame>("games", id ? { id } : null, config);
}

export function useFollowedChannels(options?: UseStoreOptions) {
  const [currentUser] = useCurrentUser(options);

  return useSWR(
    currentUser ? ["followedChannels", currentUser.id] : null,
    async () => {
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
    },
    {
      suspense: true,
    },
  );
}

function createFetcherByID<T>(path: string) {
  return (id: string[], config?: SWRConfiguration) =>
    useSWR(
      id.length > 0 ? ["itemsByID", path, id] : null,
      async () => {
        const groups = chunk(id, 100);

        const promises = await allPromises(groups, async (id) => {
          const { data } = await sendRuntimeMessage("request", path, {
            id,
          });

          return data as T[];
        });

        return flatten(promises);
      },
      config,
    );
}

export const useGamesByID = createFetcherByID<HelixGame>("games");
export const useUsersByID = createFetcherByID<HelixUser>("users");
