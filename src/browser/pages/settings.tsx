import { createHashRouter, redirect, RouterProvider } from "react-router-dom";

import { t } from "~/common/helpers";

import { SettingsProvider } from "~/browser/contexts";

import AdvancedSettings from "~/browser/views/settings/AdvancedSettings";
import BadgeSettings from "~/browser/views/settings/BadgeSettings";
import GeneralSettings from "~/browser/views/settings/GeneralSettings";
import NotificationSettings from "~/browser/views/settings/NotificationSettings";
import Root from "~/browser/views/settings/Root";
import StreamSettings from "~/browser/views/settings/StreamSettings";

import Page from "~/browser/components/Page";

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
        path: "stream",
        element: <StreamSettings />,
      },
    ],
  },
]);

function SettingsPage() {
  return (
    <SettingsProvider>
      <Page title={t("titleText_settings")}>
        <RouterProvider router={router} />
      </Page>
    </SettingsProvider>
  );
}

export default SettingsPage;
