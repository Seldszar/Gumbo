import { concat, sortBy, uniqBy } from "lodash";
import { FC, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import { filterList, isEmpty } from "~/browser/helpers/array";
import { usePinnedCategories } from "~/browser/helpers/hooks";
import { useCategories, useTopCategories } from "~/browser/helpers/queries";

import CategoryCard from "~/browser/components/cards/CategoryCard";

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

const Grid = styled.div`
  ${tw`gap-x-2 gap-y-4 grid grid-cols-4 p-3`}
`;

const Item = styled(Link)``;

const LoadMore = styled.div`
  ${tw`p-3 pt-0`}
`;

const TopCategories: FC = () => {
  const [pinnedCategories, { toggle }] = usePinnedCategories();

  const [categories, { refresh: refreshCategories }] = useCategories(
    {
      id: pinnedCategories,
    },
    {
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      revalidateOnFocus: false,
    }
  );

  const [topCategories, { error, fetchMore, hasMore, isLoadingMore, isRefreshing, refresh }] =
    useTopCategories();

  const [searchQuery, setSearchQuery] = useState("");

  const allCategories = useMemo(
    () => uniqBy(concat(sortBy(categories, "name"), topCategories ?? []), "id"),
    [categories, topCategories]
  );

  const filteredCategories = useMemo(
    () => filterList(allCategories, ["name"], searchQuery),
    [allCategories, searchQuery]
  );

  const children = useMemo(() => {
    if (error) {
      return <Splash>{error.message}</Splash>;
    }

    if (topCategories == null) {
      return <Splash isLoading />;
    }

    if (isEmpty(filteredCategories)) {
      return <Splash>{t("errorText_emptyCategories")}</Splash>;
    }

    return (
      <>
        <Grid>
          {filteredCategories.map((category) => (
            <Item key={category.id} to={`/categories/${category.id}`}>
              <CategoryCard
                category={category}
                isPinned={pinnedCategories.includes(category.id)}
                onTogglePinClick={() => toggle(category.id)}
              />
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
  }, [error, filteredCategories, hasMore, isLoadingMore, topCategories]);

  return (
    <Wrapper>
      <Header>
        <SearchInput
          onChange={setSearchQuery}
          actionButtons={[
            {
              children: <RefreshIcon isRefreshing={isRefreshing} />,
              onClick() {
                refreshCategories();
                refresh();
              },
            },
          ]}
        />
      </Header>

      {children}
    </Wrapper>
  );
};

export default TopCategories;
