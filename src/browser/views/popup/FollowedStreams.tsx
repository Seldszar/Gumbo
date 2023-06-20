import { orderBy } from "lodash-es";
import { useMemo, useState } from "react";
import tw, { styled } from "twin.macro";

import { sendRuntimeMessage, t } from "~/common/helpers";
import { FollowedStreamState } from "~/common/types";

import { useRefreshHandler } from "~/browser/contexts";
import { filterList, isEmpty } from "~/browser/helpers";
import { useFollowedStreams, useFollowedStreamState } from "~/browser/hooks";

import StreamCard from "~/browser/components/cards/StreamCard";

import CollectionList from "~/browser/components/CollectionList";
import FilterBar from "~/browser/components/FilterBar";
import Loader from "~/browser/components/Loader";
import Splash from "~/browser/components/Splash";
import TopBar from "~/browser/components/TopBar";

const Wrapper = styled.div`
  ${tw`flex flex-col min-h-full`}
`;

const StyledFilterBar = styled(FilterBar)`
  ${tw`px-4 py-3`}
`;

interface ChildComponentProps {
  followedStreamState: FollowedStreamState;
  searchQuery: string;
}

function ChildComponent(props: ChildComponentProps) {
  const { followedStreamState, searchQuery } = props;

  const [followedStreams] = useFollowedStreams({
    suspense: true,
  });

  const filteredStreams = useMemo(() => {
    let { sortDirection } = followedStreamState;

    if (followedStreamState.sortField === "startedAt") {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    }

    return orderBy(
      filterList(followedStreams, ["gameName", "title", "userLogin"], searchQuery),
      followedStreamState.sortField,
      sortDirection
    );
  }, [followedStreamState, followedStreams, searchQuery]);

  useRefreshHandler(async () => {
    await sendRuntimeMessage("refresh", true);
  });

  if (isEmpty(followedStreams)) {
    return <Splash>{t("errorText_emptyOnlineStreams")}</Splash>;
  }

  if (isEmpty(filteredStreams)) {
    return <Splash>{t("errorText_emptyStreams")}</Splash>;
  }

  return (
    <CollectionList
      type="user"
      items={filteredStreams}
      getItemIdentifier={(item) => item.userId}
      renderCollection={(items, actions) =>
        items.map((item) => (
          <StreamCard
            key={item.id}
            stream={item}
            onNewCollection={() => actions.createCollection([item.userId])}
          />
        ))
      }
    />
  );
}

export function Component() {
  const [searchQuery, setSearchQuery] = useState("");

  const [followedStreamState, { setSortDirection, setSortField }] = useFollowedStreamState();

  return (
    <Wrapper>
      <TopBar searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />

      <StyledFilterBar
        direction={followedStreamState.sortDirection}
        onDirectionChange={setSortDirection}
        filters={[
          {
            side: "right",
            value: followedStreamState.sortField,
            onChange: setSortField,
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

      <Loader>
        <ChildComponent {...{ followedStreamState, searchQuery }} />
      </Loader>
    </Wrapper>
  );
}

export default Component;
