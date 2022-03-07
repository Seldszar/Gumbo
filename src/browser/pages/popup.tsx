import React, { FC } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { useCurrentUser } from "@/browser/helpers/hooks";

import CategoryClips from "@/browser/views/category/CategoryClips";
import CategoryStreams from "@/browser/views/category/CategoryStreams";
import CategoryVideos from "@/browser/views/category/CategoryVideos";
import SearchCategories from "@/browser/views/search/SearchCategories";
import SearchChannels from "@/browser/views/search/SearchChannels";
import CategoryDetail from "@/browser/views/CategoryDetail";
import FollowedStreams from "@/browser/views/FollowedStreams";
import FollowedUsers from "@/browser/views/FollowedUsers";
import Search from "@/browser/views/Search";
import TopCategories from "@/browser/views/TopCategories";
import TopStreams from "@/browser/views/TopStreams";
import Welcome from "@/browser/views/Welcome";

import Sidebar from "@/browser/components/Sidebar";
import Splash from "@/browser/components/Splash";

const Wrapper = styled.div`
  ${tw`flex h-full relative`}
`;

const Inner = styled.div`
  ${tw`flex-1 overflow-y-scroll`}
`;

const PopupPage: FC = () => {
  const [currentUser, { isLoading }] = useCurrentUser();

  if (isLoading) {
    return <Splash isLoading />;
  }

  return (
    <Wrapper>
      {currentUser ? (
        <>
          <Sidebar user={currentUser} />
          <Inner>
            <Routes>
              <Route index element={<Navigate to="streams/followed" />} />
              <Route path="streams">
                <Route index element={<TopStreams />} />
                <Route path="followed" element={<FollowedStreams />} />
              </Route>
              <Route path="users">
                <Route index element={<FollowedUsers />} />
                <Route path="followed" element={<FollowedUsers />} />
              </Route>
              <Route path="search" element={<Search />}>
                <Route index element={<Navigate to="channels" />} />
                <Route path="channels" element={<SearchChannels />} />
                <Route path="categories" element={<SearchCategories />} />
              </Route>
              <Route path="categories">
                <Route index element={<TopCategories />} />
                <Route path=":categoryId" element={<CategoryDetail />}>
                  <Route index element={<Navigate to="streams" />} />
                  <Route path="streams" element={<CategoryStreams />} />
                  <Route path="videos" element={<CategoryVideos />} />
                  <Route path="clips" element={<CategoryClips />} />
                </Route>
              </Route>
            </Routes>
          </Inner>
        </>
      ) : (
        <Welcome />
      )}
    </Wrapper>
  );
};

export default PopupPage;
