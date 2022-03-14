import React, { FC, useMemo, useState } from "react";
import { groupBy, orderBy } from "lodash-es";
import tw, { styled } from "twin.macro";
import browser from "webextension-polyfill";

import { filterList, isEmpty } from "@/browser/helpers/array";
import {
  useFollowedStreams,
  useFollowedStreamState,
  useIsRefreshing,
  usePinnedUsers,
} from "@/browser/helpers/hooks";

import StreamCard from "@/browser/components/cards/StreamCard";
import RefreshIcon from "@/browser/components/RefreshIcon";
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

const Group = styled.div`
  &::after {
    ${tw`block border-b border-neutral-800 content mx-4 my-1`}
  }

  &:last-of-type::after {
    ${tw`hidden`}
  }
`;

const FilterSelect = styled(Select)``;

const Item = styled.div``;

const FollowedStreams: FC = () => {
  const [isRefreshing] = useIsRefreshing();
  const [followedStreams, { isLoading }] = useFollowedStreams();
  const [state, { setSortDirection, setSortField }] = useFollowedStreamState();
  const [pinnedUsers, { toggle }] = usePinnedUsers();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredStreams = useMemo(() => {
    let { sortDirection } = state;

    if (state.sortField === "started_at") {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    }

    return Object.values(
      groupBy(
        orderBy(
          filterList(followedStreams, ["game_name", "title", "user_login"], searchQuery),
          [(stream) => pinnedUsers.includes(stream.user_id), state.sortField],
          ["desc", sortDirection]
        ),
        (stream) => (pinnedUsers.includes(stream.user_id) ? 0 : 1)
      )
    );
  }, [state, followedStreams, pinnedUsers, searchQuery]);

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

    return (
      <div>
        {filteredStreams.map((streams, index) => (
          <Group key={index}>
            {streams.map((stream) => (
              <Item key={stream.id}>
                <StreamCard
                  stream={stream}
                  onTogglePinClick={() => toggle(stream.user_id)}
                  isPinned={pinnedUsers.includes(stream.user_id)}
                />
              </Item>
            ))}
          </Group>
        ))}
      </div>
    );
  }, [filteredStreams, followedStreams, isLoading, pinnedUsers]);

  return (
    <Wrapper>
      <Header>
        <SearchInput
          onChange={setSearchQuery}
          actionButtons={[
            {
              onClick: () => browser.runtime.sendMessage({ type: "refresh", args: [true, true] }),
              children: <RefreshIcon isRefreshing={isRefreshing} />,
            },
          ]}
        />
      </Header>

      <FilterWrapper>
        <FilterSelect
          value={state.sortField}
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
              label: "Viewers",
            },
          ]}
        />
        <FilterSelect
          value={state.sortDirection}
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
