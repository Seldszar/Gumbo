import React, { FC, useMemo, useState } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import { filterList, isEmpty } from "~/browser/helpers/array";
import { useStreams } from "~/browser/helpers/queries";

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

const Item = styled.div``;

const LoadMore = styled.div`
  ${tw`p-3`}
`;

const TopStreams: FC = () => {
  const [streams = [], { error, fetchMore, hasMore, isLoadingMore, isRefreshing, refresh }] =
    useStreams();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredStreams = useMemo(
    () => filterList(streams, ["game_name", "title", "user_login"], searchQuery),
    [streams, searchQuery]
  );

  const children = useMemo(() => {
    if (error) {
      return <Splash>{error.message}</Splash>;
    }

    if (streams == null) {
      return <Splash isLoading />;
    }

    if (isEmpty(filteredStreams)) {
      return <Splash>{t("errorText_emptyStreams")}</Splash>;
    }

    return (
      <>
        {filteredStreams.map((stream) => (
          <Item key={stream.id}>
            <StreamCard stream={stream} />
          </Item>
        ))}

        {hasMore && (
          <LoadMore>
            <MoreButton isLoading={isLoadingMore} fetchMore={fetchMore}>
              {t("buttonText_loadMore")}
            </MoreButton>
          </LoadMore>
        )}
      </>
    );
  }, [error, filteredStreams, hasMore, isLoadingMore, streams]);

  return (
    <Wrapper>
      <Header>
        <SearchInput
          onChange={setSearchQuery}
          actionButtons={[
            {
              onClick: () => refresh(),
              children: <RefreshIcon isRefreshing={isRefreshing} />,
            },
          ]}
        />
      </Header>

      {children}
    </Wrapper>
  );
};

export default TopStreams;
