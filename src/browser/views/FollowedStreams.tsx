import React, { FC, useMemo, useState } from "react";
import tw, { styled } from "twin.macro";

import { filterList, isEmpty } from "@/browser/helpers/array";
import { useFollowedStreams } from "@/browser/helpers/hooks";

import StreamCard from "@/browser/components/cards/StreamCard";
import SearchInput from "@/browser/components/SearchInput";
import Splash from "@/browser/components/Splash";

const Wrapper = styled.div`
  ${tw`flex flex-col min-h-full`}
`;

const Header = styled.div`
  ${tw`bg-gradient-to-b from-neutral-900 via-neutral-900 to-transparent flex-none p-3 sticky top-0 z-10`}
`;

const Item = styled.div``;

const FollowedStreams: FC = () => {
  const [followedStreams, { isLoading }] = useFollowedStreams();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredStreams = useMemo(
    () => filterList(followedStreams, ["game_name", "title", "user_login"], searchQuery),
    [followedStreams, searchQuery]
  );

  const children = useMemo(() => {
    if (isLoading) {
      return <Splash isLoading />;
    }

    if (isEmpty(followedStreams)) {
      return <Splash>No streams online</Splash>;
    }

    if (isEmpty(filteredStreams)) {
      return <Splash>No streams found</Splash>;
    }

    return filteredStreams.map((stream) => (
      <Item key={stream.id}>
        <StreamCard stream={stream} />
      </Item>
    ));
  }, [filteredStreams, isLoading]);

  return (
    <Wrapper>
      <Header>
        <SearchInput onChange={setSearchQuery} />
      </Header>

      {children}
    </Wrapper>
  );
};

export default FollowedStreams;
