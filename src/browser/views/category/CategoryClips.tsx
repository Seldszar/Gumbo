import React, { FC, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { filterList, isEmpty } from "@/browser/helpers/array";
import { useClips } from "@/browser/helpers/queries";

import ClipCard from "@/browser/components/cards/ClipCard";

import FilterBar from "@/browser/components/FilterBar";
import MoreButton from "@/browser/components/MoreButton";
import Splash from "@/browser/components/Splash";

const Header = styled.div`
  ${tw`py-3 px-4`}
`;

const List = styled.div``;

const Item = styled.div``;

const LoadMore = styled.div`
  ${tw`p-3`}
`;

const CategoryClips: FC = () => {
  const { category, searchQuery } = useOutletContext<any>();

  const [duration, setDuration] = useState<number | null>(null);

  const period = useMemo(() => {
    if (duration == null) {
      return undefined;
    }

    return {
      startedAt: new Date(Date.now() - duration),
      endedAt: new Date(),
    };
  }, [duration]);

  const [clips, { error, fetchMore, hasMore, isLoadingMore }] = useClips({
    started_at: period?.startedAt,
    ended_at: period?.endedAt,
    game_id: category.id,
  });

  const filteredClips = useMemo(
    () => filterList(clips, ["title"], searchQuery),
    [clips, searchQuery]
  );

  const children = useMemo(() => {
    if (error) {
      return <Splash>{error.message}</Splash>;
    }

    if (clips == null) {
      return <Splash isLoading />;
    }

    if (isEmpty(filteredClips)) {
      return <Splash>No clips found</Splash>;
    }

    return (
      <>
        <List>
          {filteredClips.map((clip) => (
            <Item key={clip.id}>
              <ClipCard clip={clip} />
            </Item>
          ))}
        </List>

        {hasMore && (
          <LoadMore>
            <MoreButton isLoading={isLoadingMore} fetchMore={fetchMore}>
              Load More
            </MoreButton>
          </LoadMore>
        )}
      </>
    );
  }, [clips, error, filteredClips, hasMore, isLoadingMore]);

  return (
    <>
      <Header>
        <FilterBar
          filters={[
            {
              onChange: setDuration,
              side: "left",
              value: duration,
              options: [
                {
                  value: null,
                  label: "All Time",
                },
                {
                  value: 86400000,
                  label: "Last 24 Hours",
                },
                {
                  value: 604800000,
                  label: "Last 7 Days",
                },
                {
                  value: 2592000000,
                  label: "Last 30 Days",
                },
              ],
            },
          ]}
        />
      </Header>

      {children}
    </>
  );
};

export default CategoryClips;
