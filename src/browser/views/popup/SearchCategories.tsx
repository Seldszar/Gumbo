import { Link, useOutletContext } from "react-router-dom";

import { t } from "~/common/helpers";

import { useRefreshHandler } from "~/browser/contexts";
import { isEmpty } from "~/browser/helpers";
import { useSearchCategories } from "~/browser/hooks";
import { styled } from "~/browser/styled-system/jsx";

import CategoryCard from "~/browser/components/cards/CategoryCard";

import CollectionList from "~/browser/components/CollectionList";
import Loader from "~/browser/components/Loader";
import MoreButton from "~/browser/components/MoreButton";
import Splash from "~/browser/components/Splash";

import type { OutletContext } from "./Search";

const Collection = styled("div", {
  base: {
    columnGap: 2,
    display: "grid",
    gridTemplateColumns: 4,
    px: 4,
    py: 2,
    rowGap: 4,
  },
});

const LoadMore = styled("div", {
  base: {
    px: 4,
    py: 2,
  },
});

interface ChildComponentProps {
  searchQuery: string;
}

function ChildComponent(props: ChildComponentProps) {
  const { searchQuery } = props;

  const [pages, { fetchMore, hasMore, isValidating, refresh }] = useSearchCategories(
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
    return <Splash>{t("errorText_emptyCategories")}</Splash>;
  }

  return (
    <CollectionList
      type="category"
      items={[]}
      getItemIdentifier={(item) => item.id}
      defaultItems={pages.flatMap((page) => page.data)}
      render={({ collection, items, createCollection }) => (
        <>
          <Collection>
            {items.map((category) => (
              <Link key={category.id} to={`/categories/${category.id}`}>
                <CategoryCard
                  category={category}
                  onNewCollection={() => createCollection([category.id])}
                />
              </Link>
            ))}
          </Collection>

          {collection == null && hasMore && (
            <LoadMore>
              <MoreButton isLoading={isValidating} fetchMore={fetchMore}>
                {t("buttonText_loadMore")}
              </MoreButton>
            </LoadMore>
          )}
        </>
      )}
    />
  );
}

export function Component() {
  const { searchQuery } = useOutletContext<OutletContext>();

  if (searchQuery.length === 0) {
    return <Splash>{t("messageText_typeSearchCategories")}</Splash>;
  }

  return (
    <Loader>
      <ChildComponent {...{ searchQuery }} />
    </Loader>
  );
}

export default Component;
