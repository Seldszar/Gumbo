import { FC, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import { filterList, isEmpty } from "~/browser/helpers";
import { useStreams } from "~/browser/hooks";

import StreamCard from "~/browser/components/cards/StreamCard";

import MoreButton from "~/browser/components/MoreButton";
import Splash from "~/browser/components/Splash";

const List = styled.div`
  ${tw`pt-3`}
`;

const LoadMore = styled.div`
  ${tw`p-3`}
`;

const CategoryStreams: FC = () => {
  const { category, searchQuery } = useOutletContext<any>();

  const [streams = [], { error, fetchMore, hasMore, isLoading, isValidating }] = useStreams({
    gameId: category.id,
  });

  const filteredStreams = useMemo(
    () => filterList(streams, ["gameName", "title", "userLogin"], searchQuery),
    [streams, searchQuery]
  );

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
      <List>
        {filteredStreams.map((stream) => (
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
};

export default CategoryStreams;
