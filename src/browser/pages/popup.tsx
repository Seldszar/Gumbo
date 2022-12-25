import { css, Global } from "@emotion/react";
import React, { FC } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { useCurrentUser, usePingError } from "~/browser/helpers/hooks";

import CategoryClips from "~/browser/views/popup/category/CategoryClips";
import CategoryStreams from "~/browser/views/popup/category/CategoryStreams";
import CategoryVideos from "~/browser/views/popup/category/CategoryVideos";
import SearchCategories from "~/browser/views/popup/search/SearchCategories";
import SearchChannels from "~/browser/views/popup/search/SearchChannels";
import CategoryDetail from "~/browser/views/popup/CategoryDetail";
import FollowedStreams from "~/browser/views/popup/FollowedStreams";
import FollowedUsers from "~/browser/views/popup/FollowedUsers";
import Search from "~/browser/views/popup/Search";
import TopCategories from "~/browser/views/popup/TopCategories";
import TopStreams from "~/browser/views/popup/TopStreams";
import Welcome from "~/browser/views/popup/Welcome";

import ReloadModal from "~/browser/components/modals/ReloadModal";

import Sidebar from "~/browser/components/Sidebar";
import Splash from "~/browser/components/Splash";

const Wrapper = styled.div`
  ${tw`flex flex-col h-full relative`}
`;

const Inner = styled.div`
  ${tw`flex flex-1 overflow-hidden`}
`;

const Body = styled.div`
  ${tw`flex-1 overflow-y-scroll`}
`;

const PopupPage: FC = () => {
  const [error] = usePingError();
  const [currentUser, { isLoading }] = useCurrentUser();

  if (isLoading) {
    return <Splash isLoading />;
  }

  return (
    <Wrapper>
      <Global
        styles={css`
          body {
            height: 600px;
            width: 420px;
          }
        `}
      />

      <Inner>
        {currentUser ? (
          <>
            <Sidebar user={currentUser} />
            <Body>
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
            </Body>
          </>
        ) : (
          <Welcome />
        )}
      </Inner>

      <ReloadModal isOpen={!!error} />
    </Wrapper>
  );
};

export default PopupPage;
