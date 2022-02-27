import React, { FC, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { filterList, isEmpty } from "@/browser/helpers/array";
import { useVideos } from "@/browser/helpers/queries";

import VideoCard from "@/browser/components/cards/VideoCard";
import MoreButton from "@/browser/components/MoreButton";
import Select from "@/browser/components/Select";
import Splash from "@/browser/components/Splash";

const Header = styled.div`
  ${tw`bg-gradient-to-b from-transparent to-black/20 flex gap-6 justify-end py-3 px-4`}
`;

const FilterSelect = styled(Select)``;

const List = styled.div`
  ${tw`pt-2`}
`;

const Item = styled.div``;

const LoadMore = styled.div`
  ${tw`p-3`}
`;

const CategoryVideos: FC = () => {
  const { category, searchQuery } = useOutletContext<any>();

  const [period, setPeriod] = useState("all");
  const [sort, setSort] = useState("time");
  const [type, setType] = useState("all");

  const [videos, { error, fetchMore, hasMore, isLoadingMore }] = useVideos({
    game_id: category.id,
    period,
    sort,
    type,
  });

  const filteredVideos = useMemo(
    () => filterList(videos, ["description", "title", "user_login"], searchQuery),
    [videos, searchQuery]
  );

  const children = useMemo(() => {
    if (error) {
      return <Splash>{error.message}</Splash>;
    }

    if (videos == null) {
      return <Splash isLoading />;
    }

    if (isEmpty(filteredVideos)) {
      return <Splash>No videos found</Splash>;
    }

    return (
      <>
        <List>
          {filteredVideos.map((video) => (
            <Item key={video.id}>
              <VideoCard video={video} />
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
  }, [error, filteredVideos, hasMore, isLoadingMore, videos]);

  return (
    <>
      <Header>
        <FilterSelect
          value={period}
          onChange={setPeriod}
          options={[
            {
              value: "all",
              label: "All Time",
            },
            {
              value: "day",
              label: "Last Day",
            },
            {
              value: "week",
              label: "Last Week",
            },
            {
              value: "month",
              label: "Last Month",
            },
          ]}
        />
        <FilterSelect
          value={sort}
          onChange={setSort}
          options={[
            {
              value: "time",
              label: "Time",
            },
            {
              value: "trending",
              label: "Trending",
            },
            {
              value: "views",
              label: "Views",
            },
          ]}
        />
        <FilterSelect
          value={type}
          onChange={setType}
          options={[
            {
              value: "all",
              label: "All Videos",
            },
            {
              value: "upload",
              label: "Uploads",
            },
            {
              value: "archive",
              label: "Archives",
            },
            {
              value: "highlight",
              label: "Highlights",
            },
          ]}
        />
      </Header>

      {children}
    </>
  );
};

export default CategoryVideos;
