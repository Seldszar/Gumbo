import { xor } from "es-toolkit/compat";
import { useEffect, useState } from "react";

import { Store, stores } from "~/common/stores";
import {
  Collection,
  CollectionType,
  FollowedStreamSortField,
  FollowedStreamState,
  FollowedUserSortField,
  FollowedUserState,
  SortDirection,
} from "~/common/types";

interface StoreLoader<T> {
  status: "pending" | "resolved" | "rejected";
  error?: Error;
  promise: Promise<T>;
  value: T;
}

const storeLoaders = new WeakMap<Store<any>, StoreLoader<any>>();

function fetchLoader<T>(store: Store<T>): StoreLoader<T> {
  let loader = storeLoaders.get(store);

  if (loader == null) {
    const factory = () => {
      const promise = store.get();

      const loader: StoreLoader<T> = {
        value: store.options.defaultValue,
        status: "pending",
        promise,
      };

      promise.then(
        (value) => {
          loader.status = "resolved";
          loader.value = value;

          store.onChange((value) => {
            loader.value = value;
          });

          return value;
        },
        (error) => {
          loader.status = "rejected";
          loader.error = error;

          throw error;
        },
      );

      return loader;
    };

    storeLoaders.set(store, (loader = factory()));
  }

  return loader;
}

export interface UseStoreOptions {
  suspense?: boolean;
}

export interface UseStoreState<T> {
  isLoading: boolean;
  value: T;
}

export type UseStoreReturn<T> = [
  T,
  {
    isLoading: boolean;
    set(value: T): Promise<void>;
    set(updater: (value: T) => T): Promise<void>;
  },
];

export function useStore<T>(store: Store<T>, options: UseStoreOptions = {}): UseStoreReturn<T> {
  const loader = fetchLoader(store);

  if (options.suspense) {
    switch (loader.status) {
      case "pending":
        throw loader.promise;

      case "rejected":
        throw loader.error;
    }
  }

  const [state, setState] = useState<UseStoreState<T>>({
    isLoading: loader.status === "pending",
    value: loader.value,
  });

  useEffect(() => {
    if (state.isLoading) {
      loader.promise.then((value) => {
        setState({ value, isLoading: false });
      });
    }

    return store.onChange((value) => {
      setState((state) => ({ ...state, value }));
    });
  }, []);

  return [state.value, { ...state, set: store.set.bind(store) }];
}

export type UseCollectionsReturn = [
  Collection[],
  {
    addCollection(data: Omit<Collection, "id">): void;
    updateCollection(id: string, data: Partial<Omit<Collection, "id">>): void;
    toggleCollectionItem(id: string, item: string): void;
    removeCollection(id: string): void;
  },
];

export function useCollections(
  type: CollectionType,
  options?: UseStoreOptions,
): UseCollectionsReturn {
  const [collections, store] = useStore(stores.collections, options);

  return [
    collections.filter((collection) => collection.type === type),
    {
      addCollection(data) {
        store.set((collections) => collections.concat({ ...data, type, id: crypto.randomUUID() }));
      },
      updateCollection(id, data) {
        store.set((collections) =>
          collections.map((collection) => {
            if (id === collection.id) {
              collection = { ...collection, ...data };
            }

            return collection;
          }),
        );
      },
      toggleCollectionItem(id, item) {
        store.set((collections) =>
          collections.map((collection) => {
            if (id === collection.id) {
              collection.items = xor(collection.items, [item]);
            }

            return collection;
          }),
        );
      },
      removeCollection(id) {
        store.set((collections) => collections.filter((collection) => id !== collection.id));
      },
    },
  ];
}

export function useMutedUsers(options?: UseStoreOptions) {
  const [mutedUsers, store] = useStore(stores.mutedUsers, options);

  return [
    mutedUsers,
    {
      toggle(userId: string) {
        store.set((mutedUsers) => xor(mutedUsers, [userId]));
      },
    },
  ] as const;
}

export function useCurrentUser(options?: UseStoreOptions) {
  return useStore(stores.currentUser, options);
}

export function useFollowedStreams(options?: UseStoreOptions) {
  return useStore(stores.followedStreams, options);
}

export function useAccessToken(options?: UseStoreOptions) {
  return useStore(stores.accessToken, options);
}

export function useSettings(options?: UseStoreOptions) {
  return useStore(stores.settings, options);
}

export type UseFollowedStreamStateReturn = [
  FollowedStreamState,
  {
    setSortDirection(value: SortDirection): void;
    setSortField(value: FollowedStreamSortField): void;
  },
];

export function useFollowedStreamState(options?: UseStoreOptions): UseFollowedStreamStateReturn {
  const [value, store] = useStore(stores.followedStreamState, options);

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
  },
];

export function useFollowedUserState(options?: UseStoreOptions): UseFollowedUserStateReturn {
  const [value, store] = useStore(stores.followedUserState, options);

  return [
    value,
    {
      setSortDirection: (value) => store.set((state) => ({ ...state, sortDirection: value })),
      setSortField: (value) => store.set((state) => ({ ...state, sortField: value })),
      setStatus: (value) => store.set((state) => ({ ...state, status: value })),
    },
  ];
}
