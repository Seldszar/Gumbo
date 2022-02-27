import { useEffect, useState } from "react";

import { Store, stores } from "@/common/stores";

export function useNow(interval = 1000): Date {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const handle = setInterval(() => setNow(new Date()), interval);

    return () => {
      clearInterval(handle);
    };
  }, [interval]);

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
    set(value: T): Promise<void>;
    set(updater: (value: T) => T): Promise<void>;
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

export function useFollowedUsers() {
  return useStore(stores.followedUsers);
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
