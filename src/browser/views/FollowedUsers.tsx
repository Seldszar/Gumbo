import { find, groupBy, orderBy } from "lodash-es";
import React, { FC, useMemo, useState } from "react";
import tw, { styled } from "twin.macro";

import { filterList, isEmpty } from "@/browser/helpers/array";
import {
  useFollowedStreams,
  useFollowedUsers,
  useFollowedUserState,
  usePinnedUsers,
} from "@/browser/helpers/hooks";

import UserCard from "@/browser/components/cards/UserCard";

import FilterBar from "@/browser/components/FilterBar";
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

const FollowedUsers: FC = () => {
  const [followedStreams] = useFollowedStreams();
  const [followedUsers, { isLoading }] = useFollowedUsers();
  const [state, { setSortDirection, setSortField, setStatus }] = useFollowedUserState();
  const [pinnedUsers, { toggle }] = usePinnedUsers();

  const [searchQuery, setSearchQuery] = useState("");

  const itemGroups = useMemo(() => {
    const users = orderBy(
      filterList(followedUsers, ["description", "login"], searchQuery),
      state.sortField,
      state.sortDirection
    );

    return Object.values(
      groupBy(
        users.reduce<any[]>((result, user) => {
          const stream = find(followedStreams, {
            user_id: user.id,
            type: "live",
          });

          if ([!!stream, null].includes(state.status)) {
            result.push({ stream, user });
          }

          return result;
        }, []),
        ({ user }) => (pinnedUsers.includes(user.id) ? 0 : 1)
      )
    );
  }, [state, followedUsers, followedStreams, pinnedUsers, searchQuery]);

  const children = useMemo(() => {
    if (isLoading) {
      return <Splash isLoading />;
    }

    if (isEmpty(followedUsers)) {
      return <Splash>No following users</Splash>;
    }

    if (isEmpty(itemGroups)) {
      return <Splash>No users found</Splash>;
    }

    return (
      <>
        {itemGroups.map((items, index) => (
          <Group key={index}>
            {items.map(({ user, stream }) => (
              <Item key={user.id}>
                <UserCard
                  user={user}
                  isLive={!!stream}
                  onTogglePinClick={() => toggle(user.id)}
                  isPinned={pinnedUsers.includes(user.id)}
                />
              </Item>
            ))}
          </Group>
        ))}
      </>
    );
  }, [itemGroups, followedUsers, pinnedUsers, isLoading]);

  return (
    <Wrapper>
      <Header>
        <SearchInput onChange={setSearchQuery} />
      </Header>

      <StyledFilterBar
        direction={state.sortDirection}
        onDirectionChange={setSortDirection}
        filters={[
          {
            onChange: setStatus,
            side: "left",
            value: state.status,
            options: [
              {
                value: null,
                label: "Any",
              },
              {
                value: true,
                label: "Online Only",
              },
              {
                value: false,
                label: "Offline Only",
              },
            ],
          },
          {
            onChange: setSortField,
            side: "right",
            value: state.sortField,
            options: [
              {
                value: "login",
                label: "Name",
              },
              {
                value: "view_count",
                label: "Views",
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
