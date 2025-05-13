import { createHashRouter, Navigate, RouterProvider } from "react-router";

const router = createHashRouter([
  {
    index: true,
    element: <Navigate replace to="streams/followed" />,
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
            element: <Navigate replace to="followed" />,
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
            element: <Navigate replace to="channels" />,
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
                element: <Navigate replace to="streams" />,
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
  return <RouterProvider router={router} />;
}

export default Page;
