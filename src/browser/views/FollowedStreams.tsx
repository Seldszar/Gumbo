import React, { FC, useMemo, useState } from "react";
import { orderBy } from "lodash-es";
import tw, { styled } from "twin.macro";

import { filterList, isEmpty } from "@/browser/helpers/array";
import { useFollowedStreams } from "@/browser/helpers/hooks";

import StreamCard from "@/browser/components/cards/StreamCard";
import SearchInput from "@/browser/components/SearchInput";
import Select from "@/browser/components/Select";
import Splash from "@/browser/components/Splash";

const Wrapper = styled.div`
  ${tw`flex flex-col min-h-full`}
`;

const Header = styled.div`
  ${tw`bg-gradient-to-b from-neutral-900 via-neutral-900 to-transparent flex-none p-3 sticky top-0 z-10`}
`;

const FilterWrapper = styled.div`
  ${tw`bg-gradient-to-b from-transparent to-black/20 flex gap-6 justify-end py-3 px-4`}
`;

const FilterSelect = styled(Select)``;

const Item = styled.div``;

const FollowedStreams: FC = () => {
  const [followedStreams, { isLoading }] = useFollowedStreams();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("viewer_count");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const filteredStreams = useMemo(() => {
    let direction = sortDirection;

    if (sortField === "started_at") {
      direction = direction === "asc" ? "desc" : "asc";
    }

    return orderBy(
      filterList(followedStreams, ["game_name", "title", "user_login"], searchQuery),
      sortField,
      direction
    );
  }, [sortField, sortDirection, followedStreams, searchQuery]);

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

      <FilterWrapper>
        <FilterSelect
          value={sortField}
          onChange={setSortField}
          options={[
            {
              value: "user_login",
              label: "Broadcaster",
            },
            {
              value: "game_name",
              label: "Category",
            },
            {
              value: "started_at",
              label: "Uptime",
            },
            {
              value: "viewer_count",
              label: "Viewer Count",
            },
          ]}
        />
        <FilterSelect
          value={sortDirection}
          onChange={setSortDirection}
          options={[
            {
              value: "asc",
              label: "Ascending",
            },
            {
              value: "desc",
              label: "Descending",
            },
          ]}
        />
      </FilterWrapper>

      {children}
    </Wrapper>
  );
};

export default FollowedStreams;
