import { find, groupBy, map, orderBy, some } from "lodash-es";
import { useMemo, useState } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import { useRefreshHandler } from "~/browser/contexts";
import { isEmpty, matchFields } from "~/browser/helpers";
import {
  useFollowedChannels,
  useFollowedStreams,
  useFollowedUserState,
  usePinnedUsers,
  useUsersByID,
} from "~/browser/hooks";

import UserCard from "~/browser/components/cards/UserCard";

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

const FollowingSince = styled.div`
  ${tw`truncate`}
`;

function FollowedUsers() {
  const [searchQuery, setSearchQuery] = useState("");

  const [followedStreams] = useFollowedStreams();
  const [followedUserState, { setSortDirection, setSortField, setStatus }] = useFollowedUserState();
  const [pinnedUsers, { toggle }] = usePinnedUsers();

  const { data: followedChannels = [], mutate } = useFollowedChannels();
  const { data: users = [], isLoading } = useUsersByID(map(followedChannels, "broadcasterId"));

  const items = useMemo(() => {
    const items = new Array<any>();

    users.forEach((user) => {
      const matchesFields = matchFields(user, ["displayName", "login"], searchQuery);
      const isLive = some(followedStreams, {
        userId: user.id,
        type: "live",
      });

      if (matchesFields && [isLive, null].includes(followedUserState.status)) {
        const channel = find(followedChannels, {
          broadcasterId: user.id,
        });

        items.push({
          ...user,

          followedAt: new Date(channel?.followedAt ?? 0),
          isLive,
        });
      }
    });

    return orderBy(items, followedUserState.sortField, followedUserState.sortDirection);
  }, [followedChannels, followedStreams, followedUserState, searchQuery, users]);

  const children = useMemo(() => {
    if (isLoading) {
      return <Splash isLoading />;
    }

    if (isEmpty(items)) {
      return <Splash>{t("errorText_emptyFollowingUsers")}</Splash>;
    }

    const itemGroups = Object.values(
      groupBy(items, (user) => (pinnedUsers.includes(user.id) ? 0 : 1))
    );

    return (
      <>
        {itemGroups.map((items, index) => (
          <Group key={index}>
            {items.map((user) => (
              <UserCard
                key={user.id}
                onTogglePinClick={() => toggle(user.id)}
                isPinned={pinnedUsers.includes(user.id)}
                isLive={user.isLive}
                user={user}
              >
                <FollowingSince>
                  {t("detailText_followingSince", user.followedAt.toLocaleString())}
                </FollowingSince>
              </UserCard>
            ))}
          </Group>
        ))}
      </>
    );
  }, [items, pinnedUsers, isLoading]);

  useRefreshHandler(async () => {
    await mutate();
  });

  return (
    <Wrapper>
      <TopBar searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />

      <StyledFilterBar
        direction={followedUserState.sortDirection}
        onDirectionChange={setSortDirection}
        filters={[
          {
            onChange: setStatus,
            side: "left",
            value: followedUserState.status,
            options: [
              {
                value: null,
                label: t("optionValue_status_any"),
              },
              {
                value: true,
                label: t("optionValue_status_onlineOnly"),
              },
              {
                value: false,
                label: t("optionValue_status_offlineOnly"),
              },
            ],
          },
          {
            onChange: setSortField,
            side: "right",
            value: followedUserState.sortField,
            options: [
              {
                value: "login",
                label: t("optionValue_sort_name"),
              },
              {
                value: "followedAt",
                label: t("optionValue_sort_followedAt"),
              },
            ],
          },
        ]}
      />

      {children}
    </Wrapper>
  );
}

export default FollowedUsers;
