import { xor } from "lodash-es";
import { useEffect, useState } from "react";
import { useHarmonicIntervalFn } from "react-use";

import { ClickAction } from "@/common/constants";
import { Store, stores } from "@/common/stores";
import { FollowedStreamState, FollowedUserState } from "@/common/types";

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

export function useIsRefreshing() {
  return useStore(stores.isRefreshing);
}

export type UseFollowedStreamStateReturn = [
  FollowedStreamState,
  {
    setSortDirection(value: "desc" | "asc"): void;
    setSortField(value: string): void;
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
    setSortDirection(value: "desc" | "asc"): void;
    setSortField(value: string): void;
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
