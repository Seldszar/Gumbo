import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import { useRefreshHandler } from "~/browser/contexts";
import { isEmpty } from "~/browser/helpers";
import { useStreams } from "~/browser/hooks";

import StreamCard from "~/browser/components/cards/StreamCard";

import Loader from "~/browser/components/Loader";
import MoreButton from "~/browser/components/MoreButton";
import Splash from "~/browser/components/Splash";
import TopBar from "~/browser/components/TopBar";

const Wrapper = styled.div`
  ${tw`flex flex-col min-h-full`}
`;

const LoadMore = styled.div`
  ${tw`p-3`}
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
      <div>
        {pages.map((page) => (
          <>
            {page.data.map((stream) => (
              <StreamCard key={stream.id} stream={stream} />
            ))}
          </>
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

export function Component() {
  return (
    <Wrapper>
      <TopBar />

      <Loader>
        <ChildComponent />
      </Loader>
    </Wrapper>
  );
}
