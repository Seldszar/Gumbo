import { Fragment } from "react";
import { useOutletContext } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import { useRefreshHandler } from "~/browser/contexts";
import { isEmpty } from "~/browser/helpers";
import { useSearchChannels } from "~/browser/hooks";

import ChannelCard from "~/browser/components/cards/ChannelCard";

import Loader from "~/browser/components/Loader";
import MoreButton from "~/browser/components/MoreButton";
import Splash from "~/browser/components/Splash";

import type { OutletContext } from "./Search";

const List = styled.div`
  ${tw`py-2`}
`;

const LoadMore = styled.div`
  ${tw`p-4 pt-0`}
`;

interface ChildComponentProps {
  searchQuery: string;
}

function ChildComponent(props: ChildComponentProps) {
  const { searchQuery } = props;

  const [pages, { fetchMore, hasMore, isValidating, refresh }] = useSearchChannels(
    {
      query: searchQuery,
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
    return <Splash>{t("messageText_typeSearchChannels")}</Splash>;
  }

  return (
    <>
      <List>
        {pages.map((page, index) => (
          <Fragment key={index}>
            {page.data.map((channel) => (
              <ChannelCard key={channel.id} channel={channel} />
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
  const { searchQuery } = useOutletContext<OutletContext>();

  if (searchQuery.length === 0) {
    return <Splash>{t("messageText_typeSearchChannels")}</Splash>;
  }

  return (
    <Loader>
      <ChildComponent {...{ searchQuery }} />
    </Loader>
  );
}

export default Component;
