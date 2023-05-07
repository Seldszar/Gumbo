import { useOutletContext } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import { useRefreshHandler } from "~/browser/contexts";
import { isEmpty } from "~/browser/helpers";
import { useStreams } from "~/browser/hooks";

import StreamCard from "~/browser/components/cards/StreamCard";

import MoreButton from "~/browser/components/MoreButton";
import Splash from "~/browser/components/Splash";

import { OutletContext } from "../CategoryDetail";

const List = styled.div`
  ${tw`pt-3`}
`;

const LoadMore = styled.div`
  ${tw`p-3`}
`;

function CategoryStreams() {
  const { category } = useOutletContext<OutletContext>();

  const [streams = [], { error, fetchMore, refresh, hasMore, isLoading, isValidating }] =
    useStreams({
      gameId: category.id,
    });

  useRefreshHandler(async () => {
    await refresh();
  });

  if (isLoading) {
    return <Splash isLoading />;
  }

  if (error) {
    return <Splash>{error.message}</Splash>;
  }

  if (isEmpty(streams)) {
    return <Splash>{t("errorText_emptyStreams")}</Splash>;
  }

  return (
    <>
      <List>
        {streams.map((stream) => (
          <StreamCard key={stream.id} stream={stream} />
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

export default CategoryStreams;
