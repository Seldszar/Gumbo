import React, { FC, useMemo, useState } from "react";
import { groupBy, orderBy } from "lodash-es";
import tw, { styled } from "twin.macro";

import { sendRuntimeMessage } from "@/common/helpers";

import { filterList, isEmpty } from "@/browser/helpers/array";
import {
  useFollowedStreams,
  useFollowedStreamState,
  useIsRefreshing,
  usePinnedUsers,
} from "@/browser/helpers/hooks";

import StreamCard from "@/browser/components/cards/StreamCard";

import FilterBar from "@/browser/components/FilterBar";
import RefreshIcon from "@/browser/components/RefreshIcon";
import SearchInput from "@/browser/components/SearchInput";
import Splash from "@/browser/components/Splash";

const Wrapper = styled.div`
  ${tw`flex flex-col min-h-full`}
`;

const Header = styled.div`
  ${tw`bg-gradient-to-b from-neutral-100 via-neutral-100 dark:(from-neutral-900 via-neutral-900) to-transparent flex-none p-3 sticky top-0 z-10`}
`;

const StyledFilterBar = styled(FilterBar)`
  ${tw`px-4 pb-3 pt-1`}
`;

const Group = styled.div`
  &::after {
    ${tw`block border-b border-neutral-200 dark:border-neutral-800 content mx-4 my-1`}
  }

  &:last-of-type::after {
    ${tw`hidden`}
  }
`;

const Item = styled.div``;

const FollowedStreams: FC = () => {
  const [isRefreshing] = useIsRefreshing();
  const [followedStreams, { isLoading }] = useFollowedStreams();
  const [state, { setSortDirection, setSortField }] = useFollowedStreamState();
  const [pinnedUsers, { toggle }] = usePinnedUsers();

  const [searchQuery, setSearchQuery] = useState("");

  const itemGroups = useMemo(() => {
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

    if (isEmpty(itemGroups)) {
      return <Splash>No streams found</Splash>;
    }

    return (
      <div>
        {itemGroups.map((streams, index) => (
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
  }, [itemGroups, followedStreams, isLoading, pinnedUsers]);

  return (
    <Wrapper>
      <Header>
        <SearchInput
          onChange={setSearchQuery}
          actionButtons={[
            {
              onClick: () => sendRuntimeMessage("refresh", true, true),
              children: <RefreshIcon isRefreshing={isRefreshing} />,
            },
          ]}
        />
      </Header>

      <StyledFilterBar
        direction={state.sortDirection}
        onDirectionChange={setSortDirection}
        filters={[
          {
            onChange: setSortField,
            side: "right",
            value: state.sortField,
            options: [
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
            ],
          },
        ]}
      />

      {children}
    </Wrapper>
  );
};

export default FollowedStreams;
