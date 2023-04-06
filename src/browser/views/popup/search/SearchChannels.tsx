import { useOutletContext } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import { isEmpty } from "~/browser/helpers";
import { useSearchChannels } from "~/browser/hooks";

import ChannelCard from "~/browser/components/cards/ChannelCard";

import MoreButton from "~/browser/components/MoreButton";
import Splash from "~/browser/components/Splash";

import { OutletContext } from "../Search";

const LoadMore = styled.div`
  ${tw`p-3`}
`;

function SearchChannels() {
  const { searchQuery } = useOutletContext<OutletContext>();

  const [channels, { error, fetchMore, hasMore, isLoading, isValidating }] = useSearchChannels(
    searchQuery.length > 0 && {
      query: searchQuery,
      first: 100,
    }
  );

  if (searchQuery.length === 0) {
    return <Splash>{t("messageText_typeSearchChannels")}</Splash>;
  }

  if (isLoading) {
    return <Splash isLoading />;
  }

  if (error) {
    return <Splash>{error.message}</Splash>;
  }

  if (isEmpty(channels)) {
    return <Splash>{t("errorText_emptyChannels")}</Splash>;
  }

  return (
    <>
      <div>
        {channels.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
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

export default SearchChannels;
