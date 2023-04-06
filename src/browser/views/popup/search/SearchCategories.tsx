import { Link, useOutletContext } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import { isEmpty } from "~/browser/helpers";
import { useSearchCategories } from "~/browser/hooks";

import CategoryCard from "~/browser/components/cards/CategoryCard";

import MoreButton from "~/browser/components/MoreButton";
import Splash from "~/browser/components/Splash";

import { OutletContext } from "../Search";

const Grid = styled.div`
  ${tw`gap-3 grid grid-cols-4 p-3`}
`;

const LoadMore = styled.div`
  ${tw`p-3 pt-0`}
`;

function SearchCategories() {
  const { searchQuery } = useOutletContext<OutletContext>();

  const [categories, { error, fetchMore, hasMore, isLoading, isValidating }] = useSearchCategories(
    searchQuery.length > 0 && {
      query: searchQuery,
      first: 100,
    }
  );

  if (searchQuery.length === 0) {
    return <Splash>{t("messageText_typeSearchCategories")}</Splash>;
  }

  if (isLoading) {
    return <Splash isLoading />;
  }

  if (error) {
    return <Splash>{error.message}</Splash>;
  }

  if (isEmpty(categories)) {
    return <Splash>{t("errorText_emptyCategories")}</Splash>;
  }

  return (
    <>
      <Grid>
        {categories.map((category) => (
          <Link key={category.id} to={`/categories/${category.id}`}>
            <CategoryCard category={category} />
          </Link>
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

export default SearchCategories;
