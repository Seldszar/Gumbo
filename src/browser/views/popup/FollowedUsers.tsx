import { find, groupBy, map, orderBy, some } from "lodash-es";
import { FC, useMemo, useState } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import { isEmpty, matchFields } from "~/browser/helpers/array";
import { useFollowedStreams, useFollowedUserState, usePinnedUsers } from "~/browser/helpers/hooks";
import { useFollowedChannels, useUsersByIds } from "~/browser/helpers/queries";

import UserCard from "~/browser/components/cards/UserCard";

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

const FollowingSince = styled.div`
  ${tw`truncate`}
`;

const FollowedUsers: FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const [followedStreams] = useFollowedStreams();
  const [followedUserState, { setSortDirection, setSortField, setStatus }] = useFollowedUserState();
  const [pinnedUsers, { toggle }] = usePinnedUsers();

  const { data: followedChannels = [], isValidating, mutate } = useFollowedChannels();
  const { data: users = [], isLoading } = useUsersByIds(map(followedChannels, "broadcasterId"));

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
              <Item key={user.id}>
                <UserCard
                  user={user}
                  isLive={user.isLive}
                  onTogglePinClick={() => toggle(user.id)}
                  isPinned={pinnedUsers.includes(user.id)}
                >
                  <FollowingSince>
                    {t("detailText_followingSince", user.followedAt.toLocaleString())}
                  </FollowingSince>
                </UserCard>
              </Item>
            ))}
          </Group>
        ))}
      </>
    );
  }, [items, pinnedUsers, isLoading]);

  return (
    <Wrapper>
      <Header>
        <SearchInput
          onChange={setSearchQuery}
          actionButtons={[
            {
              onClick: () => mutate(),
              children: <RefreshIcon isRefreshing={isValidating} />,
            },
          ]}
        />
      </Header>

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
};

export default FollowedUsers;
