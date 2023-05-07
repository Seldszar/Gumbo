import { css, Global } from "@emotion/react";
import { createHashRouter, redirect, RouterProvider } from "react-router-dom";

import { HistoryProvider } from "../contexts/history";
import { SearchProvider } from "../contexts/search";

import CategoryClips from "~/browser/views/popup/category/CategoryClips";
import CategoryStreams from "~/browser/views/popup/category/CategoryStreams";
import CategoryVideos from "~/browser/views/popup/category/CategoryVideos";
import SearchCategories from "~/browser/views/popup/search/SearchCategories";
import SearchChannels from "~/browser/views/popup/search/SearchChannels";
import CategoryDetail from "~/browser/views/popup/CategoryDetail";
import FollowedStreams from "~/browser/views/popup/FollowedStreams";
import FollowedUsers from "~/browser/views/popup/FollowedUsers";
import Root from "~/browser/views/popup/Root";
import Search from "~/browser/views/popup/Search";
import TopCategories from "~/browser/views/popup/TopCategories";
import TopStreams from "~/browser/views/popup/TopStreams";

const router = createHashRouter([
  {
    index: true,
    loader: () => redirect("streams/followed"),
  },
  {
    element: <Root />,
    children: [
      {
        path: "streams",
        children: [
          {
            index: true,
            element: <TopStreams />,
          },
          {
            path: "followed",
            element: <FollowedStreams />,
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
            element: <FollowedUsers />,
          },
        ],
      },
      {
        path: "search",
        element: <Search />,
        children: [
          {
            index: true,
            loader: () => redirect("channels"),
          },
          {
            path: "channels",
            element: <SearchChannels />,
          },
          {
            path: "categories",
            element: <SearchCategories />,
          },
        ],
      },
      {
        path: "categories",
        children: [
          {
            index: true,
            element: <TopCategories />,
          },
          {
            path: ":categoryId",
            element: <CategoryDetail />,
            children: [
              {
                index: true,
                loader: () => redirect("streams"),
              },
              {
                path: "streams",
                element: <CategoryStreams />,
              },
              {
                path: "videos",
                element: <CategoryVideos />,
              },
              {
                path: "clips",
                element: <CategoryClips />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

function PopupPage() {
  return (
    <HistoryProvider router={router}>
      <Global
        styles={css`
          body {
            height: 600px;
            width: 420px;
          }
        `}
      />

      <SearchProvider>
        <RouterProvider router={router} />
      </SearchProvider>
    </HistoryProvider>
  );
}

export default PopupPage;
