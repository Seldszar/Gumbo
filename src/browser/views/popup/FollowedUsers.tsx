import { find, map, orderBy, some } from "lodash-es";
import { useMemo, useState } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";
import { FollowedUserState, HelixUser } from "~/common/types";

import { useRefreshHandler } from "~/browser/contexts";
import { isEmpty, matchFields } from "~/browser/helpers";
import {
  useFollowedChannels,
  useFollowedStreams,
  useFollowedUserState,
  useUsersByID,
} from "~/browser/hooks";

import UserCard from "~/browser/components/cards/UserCard";

import CollectionList from "~/browser/components/CollectionList";
import FilterBar from "~/browser/components/FilterBar";
import Layout from "~/browser/components/Layout";
import Splash from "~/browser/components/Splash";

const Collection = styled.div`
  ${tw`py-2`}
`;

const FollowingSince = styled.div`
  ${tw`truncate`}
`;

interface FormattedUser extends HelixUser {
  followedAt: Date;
  isLive: boolean;
}

interface ChildComponentProps {
  followedUserState: FollowedUserState;
  searchQuery: string;
}

function ChildComponent(props: ChildComponentProps) {
  const { followedUserState, searchQuery } = props;

  const [followedStreams] = useFollowedStreams({
    suspense: true,
  });

  const { data: followedChannels = [], mutate } = useFollowedChannels({
    suspense: true,
  });

  const { data: followedUsers = [] } = useUsersByID(map(followedChannels, "broadcasterId"), {
    suspense: true,
  });

  const filteredUsers = useMemo(() => {
    const items = new Array<FormattedUser>();

    followedUsers.forEach((user) => {
      const matchesFields = matchFields(user, ["description", "displayName", "login"], searchQuery);
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
  }, [followedChannels, followedStreams, followedUsers, followedUserState, searchQuery]);

  useRefreshHandler(async () => {
    await mutate();
  });

  if (isEmpty(filteredUsers)) {
    return <Splash>{t("errorText_emptyFollowingUsers")}</Splash>;
  }

  return (
    <CollectionList
      type="user"
      items={filteredUsers}
      getItemIdentifier={(item) => item.id}
      render={({ items, createCollection }) => (
        <Collection>
          {items.map((item) => (
            <UserCard
              key={item.id}
              onNewCollection={() => createCollection([item.id])}
              isLive={item.isLive}
              user={item}
            >
              <FollowingSince>
                {t("detailText_followingSince", item.followedAt.toLocaleString())}
              </FollowingSince>
            </UserCard>
          ))}
        </Collection>
      )}
    />
  );
}

export function Component() {
  const [searchQuery, setSearchQuery] = useState("");

  const [followedUserState, { setSortDirection, setSortField, setStatus }] = useFollowedUserState();

  return (
    <Layout searchQuery={searchQuery} onSearchQueryChange={setSearchQuery}>
      <FilterBar
        direction={followedUserState.sortDirection}
        onDirectionChange={setSortDirection}
        filters={[
          {
            side: "left",
            value: followedUserState.status,
            onChange: setStatus,
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
            side: "right",
            value: followedUserState.sortField,
            onChange: setSortField,
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

      <ChildComponent {...{ followedUserState, searchQuery }} />
    </Layout>
  );
}

export default Component;
