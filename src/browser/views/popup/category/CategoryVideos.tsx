import { FC, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import { filterList, isEmpty } from "~/browser/helpers/array";
import { useVideos } from "~/browser/helpers/queries";

import VideoCard from "~/browser/components/cards/VideoCard";

import FilterBar from "~/browser/components/FilterBar";
import MoreButton from "~/browser/components/MoreButton";
import Splash from "~/browser/components/Splash";

const Header = styled.div`
  ${tw`py-3 px-4`}
`;

const List = styled.div``;

const Item = styled.div``;

const LoadMore = styled.div`
  ${tw`p-3`}
`;

const CategoryVideos: FC = () => {
  const { category, searchQuery } = useOutletContext<any>();

  const [period, setPeriod] = useState("all");
  const [sort, setSort] = useState("time");
  const [type, setType] = useState("all");

  const [videos = [], { error, fetchMore, hasMore, isLoadingMore }] = useVideos({
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
      return <Splash>{t("errorText_emptyVideos")}</Splash>;
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
              {t("buttonText_loadMore")}
            </MoreButton>
          </LoadMore>
        )}
      </>
    );
  }, [error, filteredVideos, hasMore, isLoadingMore, videos]);

  return (
    <>
      <Header>
        <FilterBar
          filters={[
            {
              onChange: setPeriod,
              side: "left",
              value: period,
              options: [
                {
                  value: "all",
                  label: t("optionValue_period_allTime"),
                },
                {
                  value: "day",
                  label: t("optionValue_period_lastDay"),
                },
                {
                  value: "week",
                  label: t("optionValue_period_lastWeek"),
                },
                {
                  value: "month",
                  label: t("optionValue_period_lastMonth"),
                },
              ],
            },
            {
              onChange: setType,
              side: "left",
              value: type,
              options: [
                {
                  value: "all",
                  label: t("optionValue_videoType_all"),
                },
                {
                  value: "upload",
                  label: t("optionValue_videoType_upload"),
                },
                {
                  value: "archive",
                  label: t("optionValue_videoType_archive"),
                },
                {
                  value: "highlight",
                  label: t("optionValue_videoType_highlight"),
                },
              ],
            },
            {
              onChange: setSort,
              side: "right",
              value: sort,
              options: [
                {
                  value: "time",
                  label: t("optionValue_sort_time"),
                },
                {
                  value: "trending",
                  label: t("optionValue_sort_trending"),
                },
                {
                  value: "views",
                  label: t("optionValue_sort_views"),
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

export default CategoryVideos;
