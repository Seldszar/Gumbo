import { Link } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import { useRefreshHandler } from "~/browser/contexts";
import { isEmpty } from "~/browser/helpers";
import { useTopCategories } from "~/browser/hooks";

import CategoryCard from "~/browser/components/cards/CategoryCard";

import Loader from "~/browser/components/Loader";
import MoreButton from "~/browser/components/MoreButton";
import Splash from "~/browser/components/Splash";
import TopBar from "~/browser/components/TopBar";

const Wrapper = styled.div`
  ${tw`flex flex-col min-h-full`}
`;

const Grid = styled.div`
  ${tw`gap-x-2 gap-y-4 grid grid-cols-4 p-4`}
`;

const LoadMore = styled.div`
  ${tw`p-3`}
`;

export function ChildComponent() {
  const [pages, { fetchMore, hasMore, isValidating, refresh }] = useTopCategories(
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

  if (isEmpty(pages)) {
    return <Splash>{t("errorText_emptyCategories")}</Splash>;
  }

  return (
    <>
      <Grid>
        {pages.map((page) => (
          <>
            {page.data.map((category) => (
              <Link key={category.id} to={`/categories/${category.id}`}>
                <CategoryCard category={category} />
              </Link>
            ))}
          </>
        ))}
      </Grid>

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
