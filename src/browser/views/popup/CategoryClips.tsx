import { Fragment, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import { useRefreshHandler } from "~/browser/contexts";
import { isEmpty } from "~/browser/helpers";
import { useClips } from "~/browser/hooks";

import ClipCard from "~/browser/components/cards/ClipCard";

import FilterBar from "~/browser/components/FilterBar";
import Loader from "~/browser/components/Loader";
import MoreButton from "~/browser/components/MoreButton";
import Splash from "~/browser/components/Splash";

import type { OutletContext } from "./Category";

const List = styled.div`
  ${tw`py-2`}
`;

const LoadMore = styled.div`
  ${tw`p-4 pt-0`}
`;

interface ChildComponentProps {
  duration: number | null;
}

function ChildComponent(props: ChildComponentProps) {
  const { category } = useOutletContext<OutletContext>();

  const period = useMemo(() => {
    if (props.duration == null) {
      return undefined;
    }

    return {
      startedAt: new Date(Date.now() - props.duration),
      endedAt: new Date(),
    };
  }, [props.duration]);

  const [pages, { fetchMore, refresh, hasMore, isValidating }] = useClips(
    {
      startedAt: period?.startedAt,
      endedAt: period?.endedAt,
      gameId: category.id,
      first: 100,
    },
    {
      suspense: true,
    },
  );

  useRefreshHandler(async () => {
    await refresh();
  });

  if (isEmpty(pages)) {
    return <Splash>{t("errorText_emptyClips")}</Splash>;
  }

  return (
    <>
      <List>
        {pages.map((page, index) => (
          <Fragment key={index}>
            {page.data.map((clip) => (
              <ClipCard key={clip.id} clip={clip} />
            ))}
          </Fragment>
        ))}
      </List>

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
  const [duration, setDuration] = useState<number | null>(null);

  return (
    <>
      <FilterBar
        filters={[
          {
            side: "left",
            value: duration,
            onChange: setDuration,
            options: [
              {
                value: null,
                label: t("optionValue_period_allTime"),
              },
              {
                value: 86400000,
                label: t("optionValue_period_lastHours", "24"),
              },
              {
                value: 604800000,
                label: t("optionValue_period_lastDays", "7"),
              },
              {
                value: 2592000000,
                label: t("optionValue_period_lastDays", "30"),
              },
            ],
          },
        ]}
      />

      <Loader>
        <ChildComponent {...{ duration }} />
      </Loader>
    </>
  );
}

export default Component;
