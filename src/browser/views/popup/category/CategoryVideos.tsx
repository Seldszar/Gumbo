import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import { filterList, isEmpty } from "~/browser/helpers";
import { useVideos } from "~/browser/hooks";

import VideoCard from "~/browser/components/cards/VideoCard";

import FilterBar from "~/browser/components/FilterBar";
import MoreButton from "~/browser/components/MoreButton";
import Splash from "~/browser/components/Splash";

const Header = styled.div`
  ${tw`py-3 px-4`}
`;

const LoadMore = styled.div`
  ${tw`p-3`}
`;

function CategoryVideos() {
  const { category, searchQuery } = useOutletContext<any>();

  const [period, setPeriod] = useState("all");
  const [sort, setSort] = useState("time");
  const [type, setType] = useState("all");

  const [videos = [], { error, fetchMore, hasMore, isLoading, isValidating }] = useVideos({
    gameId: category.id,
    first: 100,
    period,
    sort,
    type,
  });

  const filteredVideos = useMemo(
    () => filterList(videos, ["description", "title", "userLogin"], searchQuery),
    [videos, searchQuery]
  );

  const children = useMemo(() => {
    if (isLoading) {
      return <Splash isLoading />;
    }

    if (error) {
      return <Splash>{error.message}</Splash>;
    }

    if (isEmpty(filteredVideos)) {
      return <Splash>{t("errorText_emptyVideos")}</Splash>;
    }

    return (
      <>
        <div>
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        {hasMore && (
          <LoadMore>
            <MoreButton isLoading={isValidating} fetchMore={fetchMore}>
              {t("buttonText_loadMore")}
            </MoreButton>
          </LoadMore>
        )}
      </>
    );
  }, [error, filteredVideos, hasMore, isLoading, isValidating, videos]);

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
}

export default CategoryVideos;
