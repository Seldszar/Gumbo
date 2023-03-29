import { get, set } from "lodash-es";
import { createContext, useContext } from "react";
import { createHashRouter, redirect, RouterProvider } from "react-router-dom";

import { t } from "~/common/helpers";
import { Settings } from "~/common/types";

import { usePingError, useSettings } from "~/browser/helpers/hooks";

import AdvancedSettings from "~/browser/views/settings/AdvancedSettings";
import BadgeSettings from "~/browser/views/settings/BadgeSettings";
import GeneralSettings from "~/browser/views/settings/GeneralSettings";
import NotificationSettings from "~/browser/views/settings/NotificationSettings";
import Root from "~/browser/views/settings/Root";
import SearchSettings from "~/browser/views/settings/SearchSettings";
import StreamSettings from "~/browser/views/settings/StreamSettings";

import Page from "~/browser/components/Page";

import ReloadModal from "~/browser/components/modals/ReloadModal";

const Context = createContext<any>(null);

export interface SettingsContext {
  register(name: string): any;
  settings: Settings;
}

export function useSettingsContext(): SettingsContext {
  return useContext(Context);
}

const router = createHashRouter([
  {
    index: true,
    loader: () => redirect("general"),
  },
  {
    element: <Root />,
    children: [
      {
        path: "advanced",
        element: <AdvancedSettings />,
      },
      {
        path: "badge",
        element: <BadgeSettings />,
      },
      {
        path: "general",
        element: <GeneralSettings />,
      },
      {
        path: "notification",
        element: <NotificationSettings />,
      },
      {
        path: "search",
        element: <SearchSettings />,
      },
      {
        path: "stream",
        element: <StreamSettings />,
      },
    ],
  },
]);

function SettingsPage() {
  const [error] = usePingError();
  const [settings, store] = useSettings();

  const register = (path: string) => ({
    value: get(settings, path),
    onChange(value: unknown) {
      store.set(set(settings, path, value));
    },
  });

  return (
    <Context.Provider value={{ register, settings }}>
      <Page title={t("titleText_settings")}>
        <RouterProvider router={router} />
      </Page>

      <ReloadModal isOpen={!!error} />
    </Context.Provider>
  );
}

export default SettingsPage;
