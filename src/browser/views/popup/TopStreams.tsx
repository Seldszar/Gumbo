import { FC, useMemo, useState } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import { filterList, isEmpty } from "~/browser/helpers";
import { useStreams } from "~/browser/hooks";

import StreamCard from "~/browser/components/cards/StreamCard";

import MoreButton from "~/browser/components/MoreButton";
import RefreshIcon from "~/browser/components/RefreshIcon";
import SearchInput from "~/browser/components/SearchInput";
import Splash from "~/browser/components/Splash";

const Wrapper = styled.div`
  ${tw`flex flex-col min-h-full`}
`;

const Header = styled.div`
  ${tw`bg-gradient-to-b from-neutral-100 via-neutral-100 dark:(from-neutral-900 via-neutral-900) to-transparent flex-none p-3 sticky top-0 z-10`}
`;

const LoadMore = styled.div`
  ${tw`p-3`}
`;

const TopStreams: FC = () => {
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
      <Header>
        <SearchInput
          onChange={setSearchQuery}
          actionButtons={[
            {
              onClick: () => refresh(),
              children: <RefreshIcon isSpinning={isValidating} />,
            },
          ]}
        />
      </Header>

      {children}
    </Wrapper>
  );
};

export default TopStreams;
