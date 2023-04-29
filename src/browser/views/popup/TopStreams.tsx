import { useMemo, useState } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import { filterList, isEmpty } from "~/browser/helpers";
import { useStreams } from "~/browser/hooks";

import StreamCard from "~/browser/components/cards/StreamCard";

import MoreButton from "~/browser/components/MoreButton";
import ReloadIcon from "~/browser/components/ReloadIcon";
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

  const [searchQuery, setSearchQuery] = useState("");

  const filteredStreams = useMemo(
    () => filterList(streams, ["gameName", "title", "userLogin"], searchQuery),
    [streams, searchQuery]
  );

  const children = useMemo(() => {
    if (isLoading) {
      return <Splash isLoading />;
    }

    if (error) {
      return <Splash>{error.message}</Splash>;
    }

    if (isEmpty(filteredStreams)) {
      return <Splash>{t("errorText_emptyStreams")}</Splash>;
    }

    return (
      <>
        <div>
          {filteredStreams.map((stream) => (
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
  }, [error, filteredStreams, hasMore, isLoading, isValidating, streams]);

  return (
    <Wrapper>
      <TopBar
        rightOrnament={[
          {
            onClick: () => refresh(),
            children: <ReloadIcon size="1.25rem" isSpinning={isValidating} />,
          },
        ]}
      />

      {children}
    </Wrapper>
  );
}

export default TopStreams;
