import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import { useRefreshHandler } from "~/browser/contexts";
import { isEmpty } from "~/browser/helpers";
import { useVideos } from "~/browser/hooks";

import VideoCard from "~/browser/components/cards/VideoCard";

import FilterBar from "~/browser/components/FilterBar";
import Loader from "~/browser/components/Loader";
import MoreButton from "~/browser/components/MoreButton";
import Splash from "~/browser/components/Splash";

import type { OutletContext } from "./Category";

const StyledFilterBar = styled(FilterBar)`
  ${tw`px-4 py-3`}
`;

const LoadMore = styled.div`
  ${tw`p-3`}
`;

interface ChildComponentProps {
  period: string;
  sort: string;
  type: string;
}

function ChildComponent(props: ChildComponentProps) {
  const { category } = useOutletContext<OutletContext>();

  const [pages, { fetchMore, hasMore, isValidating, refresh }] = useVideos(
    {
      gameId: category.id,
      period: props.period,
      sort: props.sort,
      type: props.type,
      first: 100,
    },
    {
      suspense: true,
    }
  );

  useRefreshHandler(async () => {
    await refresh();
  });

  if (isEmpty(pages)) {
    return <Splash>{t("errorText_emptyVideos")}</Splash>;
  }

  return (
    <>
      <div>
        {pages.map((page) => (
          <>
            {page.data.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </>
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
}

export function Component() {
  const [period, setPeriod] = useState("all");
  const [sort, setSort] = useState("time");
  const [type, setType] = useState("all");

  return (
    <>
      <StyledFilterBar
        filters={[
          {
            side: "left",
            value: period,
            onChange: setPeriod,
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

      <Loader>
        <ChildComponent {...{ period, sort, type }} />
      </Loader>
    </>
  );
}

export default Component;
