import { Fragment } from "react";
import { useOutletContext } from "react-router";

import { t } from "~/common/helpers";

import { useRefreshHandler } from "~/browser/contexts";
import { isEmpty } from "~/browser/helpers";
import { useStreams } from "~/browser/hooks";
import { styled } from "~/browser/styled-system/jsx";

import StreamCard from "~/browser/components/cards/StreamCard";

import Loader from "~/browser/components/Loader";
import MoreButton from "~/browser/components/MoreButton";
import Splash from "~/browser/components/Splash";

import type { OutletContext } from "./Category";

const List = styled("div", {
  base: {
    py: 2,
  },
});

const LoadMore = styled("div", {
  base: {
    p: 4,
    pt: 0,
  },
});

function ChildComponent() {
  const { category } = useOutletContext<OutletContext>();

  const [pages, { fetchMore, refresh, hasMore, isValidating }] = useStreams(
    {
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
    return <Splash>{t("errorText_emptyStreams")}</Splash>;
  }

  return (
    <>
      <List>
        {pages.map((page, index) => (
          <Fragment key={index}>
            {page.data.map((stream) => (
              <StreamCard key={stream.id} stream={stream} />
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
  return (
    <Loader>
      <ChildComponent />
    </Loader>
  );
}

export default Component;
