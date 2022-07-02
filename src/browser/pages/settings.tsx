import { get, set } from "lodash-es";
import React, { createContext, FC, useContext } from "react";
import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { t } from "@/common/helpers";
import { Settings } from "@/common/types";

import { usePingError, useSettings } from "@/browser/helpers/hooks";

import AdvancedSettings from "@/browser/views/settings/AdvancedSettings";
import BadgeSettings from "@/browser/views/settings/BadgeSettings";
import GeneralSettings from "@/browser/views/settings/GeneralSettings";
import NotificationSettings from "@/browser/views/settings/NotificationSettings";
import SearchSettings from "@/browser/views/settings/SearchSettings";
import StreamSettings from "@/browser/views/settings/StreamSettings";

import Page from "@/browser/components/Page";

import ReloadModal from "@/browser/components/modals/ReloadModal";

const Wrapper = styled.div`
  ${tw`flex gap-6 items-start max-w-2xl w-full`}
`;

const Aside = styled.div`
  ${tw`flex-shrink-0 grid gap-4 sticky top-6 w-64`}
`;

const MenuItem = styled(NavLink)`
  ${tw`block text-neutral-600 text-lg hover:text-black dark:(text-neutral-400 hover:text-white)`}

  &.active {
    ${tw`text-purple-500!`}
  }
`;

const Inner = styled.div`
  ${tw`flex-1`}
`;

const Context = createContext<any>(null);

export interface SettingsContext {
  register(name: string): any;
  settings: Settings;
}

export function useSettingsContext(): SettingsContext {
  return useContext(Context);
}

const SettingsPage: FC = () => {
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
        <Wrapper>
          <Aside>
            <MenuItem to="general">{t("titleText_general")}</MenuItem>
            <MenuItem to="badge">{t("titleText_badge")}</MenuItem>
            <MenuItem to="notification">{t("titleText_notifications")}</MenuItem>
            <MenuItem to="search">{t("titleText_search")}</MenuItem>
            <MenuItem to="stream">{t("titleText_streams")}</MenuItem>
            <MenuItem to="advanced">{t("titleText_advanced")}</MenuItem>
          </Aside>
          <Inner>
            <Routes>
              <Route index element={<Navigate to="general" />} />
              <Route path="advanced" element={<AdvancedSettings />} />
              <Route path="badge" element={<BadgeSettings />} />
              <Route path="general" element={<GeneralSettings />} />
              <Route path="notification" element={<NotificationSettings />} />
              <Route path="search" element={<SearchSettings />} />
              <Route path="stream" element={<StreamSettings />} />
            </Routes>
          </Inner>
        </Wrapper>

        <ReloadModal isOpen={!!error} />
      </Page>
    </Context.Provider>
  );
};

export default SettingsPage;
