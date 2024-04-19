import "../assets/styles/popup.css";

import { createHashRouter, redirect, RouterProvider } from "react-router-dom";

import { HistoryProvider } from "../contexts/history";
import { SearchProvider } from "../contexts/search";

const router = createHashRouter([
  {
    index: true,
    loader: () => redirect("streams/followed"),
  },
  {
    lazy: () => import("../views/popup/Root"),
    children: [
      {
        path: "streams",
        children: [
          {
            index: true,
            lazy: () => import("../views/popup/TopStreams"),
          },
          {
            path: "followed",
            lazy: () => import("../views/popup/FollowedStreams"),
          },
        ],
      },
      {
        path: "users",
        children: [
          {
            index: true,
            loader: () => redirect("followed"),
          },
          {
            path: "followed",
            lazy: () => import("../views/popup/FollowedUsers"),
          },
        ],
      },
      {
        path: "search",
        lazy: () => import("../views/popup/Search"),
        children: [
          {
            index: true,
            loader: () => redirect("channels"),
          },
          {
            path: "channels",
            lazy: () => import("../views/popup/SearchChannels"),
          },
          {
            path: "categories",
            lazy: () => import("../views/popup/SearchCategories"),
          },
        ],
      },
      {
        path: "categories",
        children: [
          {
            index: true,
            lazy: () => import("../views/popup/TopCategories"),
          },
          {
            path: ":categoryId",
            lazy: () => import("../views/popup/Category"),
            children: [
              {
                index: true,
                loader: () => redirect("streams"),
              },
              {
                path: "streams",
                lazy: () => import("../views/popup/CategoryStreams"),
              },
              {
                path: "videos",
                lazy: () => import("../views/popup/CategoryVideos"),
              },
              {
                path: "clips",
                lazy: () => import("../views/popup/CategoryClips"),
              },
            ],
          },
        ],
      },
    ],
  },
]);

function Page() {
  return (
    <HistoryProvider router={router}>
      <SearchProvider>
        <RouterProvider router={router} />
      </SearchProvider>
    </HistoryProvider>
  );
}

export default Page;
