import React, { FC } from "react";
import { Link, useOutletContext } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { t } from "@/common/helpers";

import { isEmpty } from "@/browser/helpers/array";
import { useSearchCategories } from "@/browser/helpers/queries";

import CategoryCard from "@/browser/components/cards/CategoryCard";

import MoreButton from "@/browser/components/MoreButton";
import Splash from "@/browser/components/Splash";

const Grid = styled.div`
  ${tw`gap-3 grid grid-cols-4 p-3`}
`;

const Item = styled(Link)``;

const LoadMore = styled.div`
  ${tw`p-3 pt-0`}
`;

const SearchCategories: FC = () => {
  const { searchQuery } = useOutletContext<any>();

  const [categories, { error, fetchMore, hasMore, isLoadingMore }] = useSearchCategories({
    query: searchQuery,
  });

  if (searchQuery.length === 0) {
    return <Splash>{t("messageText_typeSearchCategories")}</Splash>;
  }

  if (error) {
    return <Splash>{error.message}</Splash>;
  }

  if (categories == null) {
    return <Splash isLoading />;
  }

  if (isEmpty(categories)) {
    return <Splash>{t("errorText_emptyCategories")}</Splash>;
  }

  return (
    <>
      <Grid>
        {categories.map((category) => (
          <Item key={category.id} to={`/categories/${category.id}`}>
            <CategoryCard category={category} />
          </Item>
        ))}
      </Grid>

      {hasMore && (
        <LoadMore>
          <MoreButton isLoading={isLoadingMore} fetchMore={fetchMore}>
            {t("buttonText_loadMore")}
          </MoreButton>
        </LoadMore>
      )}
    </>
  );
};

export default SearchCategories;
