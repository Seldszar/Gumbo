import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import { useRefreshHandler } from "~/browser/contexts";
import { isEmpty } from "~/browser/helpers";
import { useStreams } from "~/browser/hooks";

import StreamCard from "~/browser/components/cards/StreamCard";

import Layout from "~/browser/components/Layout";
import MoreButton from "~/browser/components/MoreButton";
import Splash from "~/browser/components/Splash";

const List = styled.div`
  ${tw`py-2`}
`;

const LoadMore = styled.div`
  ${tw`p-4 pt-0`}
`;

export function ChildComponent() {
  const [pages, { error, fetchMore, hasMore, isValidating, refresh }] = useStreams(
    {
      first: 100,
    },
    {
      suspense: true,
    }
  );

  useRefreshHandler(async () => {
    await refresh();
  });

  if (error) {
    return <Splash>{error.message}</Splash>;
  }

  if (isEmpty(pages)) {
    return <Splash>{t("errorText_emptyStreams")}</Splash>;
  }

  return (
    <>
      <List>
        {pages.map((page) => (
          <>
            {page.data.map((stream) => (
              <StreamCard key={stream.id} stream={stream} />
            ))}
          </>
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
    <Layout>
      <ChildComponent />
    </Layout>
  );
}
