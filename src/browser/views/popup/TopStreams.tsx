import { useMemo } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import { useRefreshHandler } from "~/browser/contexts";
import { isEmpty } from "~/browser/helpers";
import { useStreams } from "~/browser/hooks";

import StreamCard from "~/browser/components/cards/StreamCard";

import MoreButton from "~/browser/components/MoreButton";
import Splash from "~/browser/components/Splash";
import TopBar from "~/browser/components/TopBar";

const Wrapper = styled.div`
  ${tw`flex flex-col min-h-full`}
`;

const LoadMore = styled.div`
  ${tw`p-3`}
`;

function TopStreams() {
  const [streams = [], { error, fetchMore, hasMore, isLoading, isValidating, refresh }] =
    useStreams();

  const children = useMemo(() => {
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
        <div>
          {streams.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
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
  }, [error, hasMore, isLoading, isValidating, streams]);

  useRefreshHandler(async () => {
    await refresh();
  });

  return (
    <Wrapper>
      <TopBar />

      {children}
    </Wrapper>
  );
}

export default TopStreams;
