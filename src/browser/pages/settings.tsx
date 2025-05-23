import { createHashRouter, Navigate, RouterProvider } from "react-router";

import { SettingsProvider } from "../contexts";

const router = createHashRouter([
  {
    index: true,
    element: <Navigate replace to="general" />,
  },
  {
    lazy: () => import("../views/settings/Root"),
    children: [
      {
        path: "advanced",
        lazy: () => import("../views/settings/AdvancedSettings"),
      },
      {
        path: "badge",
        lazy: () => import("../views/settings/BadgeSettings"),
      },
      {
        path: "dropdown-menu",
        lazy: () => import("../views/settings/DropdownMenuSettings"),
      },
      {
        path: "general",
        lazy: () => import("../views/settings/GeneralSettings"),
      },
      {
        path: "notification",
        lazy: () => import("../views/settings/NotificationSettings"),
      },
      {
        path: "stream",
        lazy: () => import("../views/settings/StreamSettings"),
      },
    ],
  },
]);

function Page() {
  return (
    <SettingsProvider>
      <RouterProvider router={router} />
    </SettingsProvider>
  );
}

export default Page;
