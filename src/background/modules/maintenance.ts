import { get } from "es-toolkit/compat";

import { stores, StoreState } from "~/common/stores";
import { Dictionary } from "~/common/types";

export async function backup() {
  const collections = await stores.collections.getState();
  const followedStreamState = await stores.followedStreamState.getState();
  const followedUserState = await stores.followedUserState.getState();
  const settings = await stores.settings.getState();

  return { collections, followedStreamState, followedUserState, settings };
}

export async function restore(data: Dictionary<StoreState<any>>) {
  for (const [name, state] of Object.entries(data)) {
    const store = get(stores, name);

    if (store) {
      await store.restore(state);
    }
  }
}

export async function reset() {
  await chrome.storage.local.clear();
  await chrome.storage.session.clear();
  await chrome.storage.sync.clear();

  chrome.runtime.reload();
}
