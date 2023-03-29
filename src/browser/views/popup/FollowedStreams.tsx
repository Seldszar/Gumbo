import { FC, useMemo, useState } from "react";
import { groupBy, orderBy } from "lodash-es";
import { useAsyncFn } from "react-use";
import tw, { styled } from "twin.macro";

import { sendRuntimeMessage, t } from "~/common/helpers";

import { filterList, isEmpty } from "~/browser/helpers/array";
import {
  useFollowedStreams,
  useFollowedStreamState,
  usePinnedUsers,
} from "~/browser/helpers/hooks";

import StreamCard from "~/browser/components/cards/StreamCard";

import FilterBar from "~/browser/components/FilterBar";
import RefreshIcon from "~/browser/components/RefreshIcon";
import SearchInput from "~/browser/components/SearchInput";
import Splash from "~/browser/components/Splash";

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
  const [searchQuery, setSearchQuery] = useState("");

  const [followedStreams, { isLoading }] = useFollowedStreams();
  const [followedStreamState, { setSortDirection, setSortField }] = useFollowedStreamState();
  const [pinnedUsers, { toggle }] = usePinnedUsers();

  const [refreshState, doRefresh] = useAsyncFn(() => sendRuntimeMessage("refresh", true), []);

  const itemGroups = useMemo(() => {
    let { sortDirection } = followedStreamState;

    if (followedStreamState.sortField === "started_at") {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    }

    return Object.values(
      groupBy(
        orderBy(
          filterList(followedStreams, ["game_name", "title", "user_login"], searchQuery),
          [(stream) => pinnedUsers.includes(stream.user_id), followedStreamState.sortField],
          ["desc", sortDirection]
        ),
        (stream) => (pinnedUsers.includes(stream.user_id) ? 0 : 1)
      )
    );
  }, [followedStreamState, followedStreams, pinnedUsers, searchQuery]);

  const children = useMemo(() => {
    if (isLoading) {
      return <Splash isLoading />;
    }

    if (isEmpty(followedStreams)) {
      return <Splash>{t("errorText_emptyOnlineStreams")}</Splash>;
    }

    if (isEmpty(itemGroups)) {
      return <Splash>{t("errorText_emptyStreams")}</Splash>;
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
              onClick: () => doRefresh(),
              children: <RefreshIcon isRefreshing={refreshState.loading} />,
            },
          ]}
        />
      </Header>

      <StyledFilterBar
        direction={followedStreamState.sortDirection}
        onDirectionChange={setSortDirection}
        filters={[
          {
            onChange: setSortField,
            side: "right",
            value: followedStreamState.sortField,
            options: [
              {
                value: "user_login",
                label: t("optionValue_sort_login"),
              },
              {
                value: "game_name",
                label: t("optionValue_sort_category"),
              },
              {
                value: "started_at",
                label: t("optionValue_sort_uptime"),
              },
              {
                value: "viewer_count",
                label: t("optionValue_sort_viewers"),
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
