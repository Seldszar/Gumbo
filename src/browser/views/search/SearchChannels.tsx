import React, { FC } from "react";
import { useOutletContext } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { isEmpty } from "@/browser/helpers/array";
import { useSearchChannels } from "@/browser/helpers/queries";

import ChannelCard from "@/browser/components/cards/ChannelCard";

import MoreButton from "@/browser/components/MoreButton";
import Splash from "@/browser/components/Splash";

const List = styled.div``;

const Item = styled.div``;

const LoadMore = styled.div`
  ${tw`p-3`}
`;

const SearchChannels: FC = () => {
  const { searchQuery } = useOutletContext<any>();

  const [channels, { error, fetchMore, hasMore, isLoadingMore }] = useSearchChannels({
    query: searchQuery,
  });

  if (searchQuery.length === 0) {
    return <Splash>Start typing to search channels</Splash>;
  }

  if (error) {
    return <Splash>{error.message}</Splash>;
  }

  if (channels == null) {
    return <Splash isLoading />;
  }

  if (isEmpty(channels)) {
    return <Splash>No channels found</Splash>;
  }

  return (
    <>
      <List>
        {channels.map((channel) => (
          <Item key={channel.id}>
            <ChannelCard channel={channel} />
          </Item>
        ))}
      </List>

      {hasMore && (
        <LoadMore>
          <MoreButton isLoading={isLoadingMore} fetchMore={fetchMore}>
            Load More
          </MoreButton>
        </LoadMore>
      )}
    </>
  );
};

export default SearchChannels;
