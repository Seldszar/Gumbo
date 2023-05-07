import { groupBy, orderBy } from "lodash-es";
import { useMemo, useState } from "react";
import tw, { styled } from "twin.macro";

import { sendRuntimeMessage, t } from "~/common/helpers";

import { useRefreshHandler } from "~/browser/contexts";
import { filterList, isEmpty } from "~/browser/helpers";
import { useFollowedStreams, useFollowedStreamState, usePinnedUsers } from "~/browser/hooks";

import StreamCard from "~/browser/components/cards/StreamCard";

import FilterBar from "~/browser/components/FilterBar";
import Splash from "~/browser/components/Splash";
import TopBar from "~/browser/components/TopBar";

const Wrapper = styled.div`
  ${tw`flex flex-col min-h-full`}
`;

const StyledFilterBar = styled(FilterBar)`
  ${tw`px-4 py-3`}
`;

const Group = styled.div`
  ${tw`after:(block border-b border-neutral-200 content-[''] mx-4 my-1 dark:border-neutral-800) last:after:hidden`}
`;

function FollowedStreams() {
  const [searchQuery, setSearchQuery] = useState("");

  const [followedStreams, { isLoading }] = useFollowedStreams();
  const [followedStreamState, { setSortDirection, setSortField }] = useFollowedStreamState();
  const [pinnedUsers, { toggle }] = usePinnedUsers();

  const itemGroups = useMemo(() => {
    let { sortDirection } = followedStreamState;

    if (followedStreamState.sortField === "startedAt") {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    }

    return Object.values(
      groupBy(
        orderBy(
          filterList(followedStreams, ["gameName", "title", "userLogin"], searchQuery),
          [(stream) => pinnedUsers.includes(stream.userId), followedStreamState.sortField],
          ["desc", sortDirection]
        ),
        (stream) => (pinnedUsers.includes(stream.userId) ? 0 : 1)
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
              <StreamCard
                key={stream.id}
                onTogglePinClick={() => toggle(stream.userId)}
                isPinned={pinnedUsers.includes(stream.userId)}
                stream={stream}
              />
            ))}
          </Group>
        ))}
      </div>
    );
  }, [itemGroups, followedStreams, isLoading, pinnedUsers]);

  useRefreshHandler(async () => {
    await sendRuntimeMessage("refresh", true);
  });

  return (
    <Wrapper>
      <TopBar searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />

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
                value: "userLogin",
                label: t("optionValue_sort_login"),
              },
              {
                value: "gameName",
                label: t("optionValue_sort_category"),
              },
              {
                value: "startedAt",
                label: t("optionValue_sort_uptime"),
              },
              {
                value: "viewerCount",
                label: t("optionValue_sort_viewers"),
              },
            ],
          },
        ]}
      />

      {children}
    </Wrapper>
  );
}

export default FollowedStreams;
