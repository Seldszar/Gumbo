import { FC, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import { filterList, isEmpty } from "~/browser/helpers";
import { useCategories, usePinnedCategories, useTopCategories } from "~/browser/hooks";

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

const Group = styled.div`
  ${tw`after:(block border-b border-neutral-200 dark:border-neutral-800 content mx-4 my-1 last:hidden)`}
`;

const Grid = styled.div`
  ${tw`gap-x-2 gap-y-4 grid grid-cols-4 p-3`}
`;

const LoadMore = styled.div`
  ${tw`p-3 pt-0`}
`;

const TopCategories: FC = () => {
  const [pinnedCategories, { toggle }] = usePinnedCategories();

  const [categories = [], pinnedResponse] = useCategories({
    id: pinnedCategories,
  });

  const [searchQuery, setSearchQuery] = useState("");

  const [topCategories = [], topResponse] = useTopCategories({
    first: 100,
  });

  const filteredCategories = useMemo(
    () => filterList(topCategories, ["name"], searchQuery),
    [topCategories, searchQuery]
  );

  const children = useMemo(() => {
    if (topResponse.isLoading) {
      return <Splash isLoading />;
    }

    if (pinnedResponse.error) {
      return <Splash>{pinnedResponse.error.message}</Splash>;
    }

    if (topResponse.error) {
      return <Splash>{topResponse.error.message}</Splash>;
    }

    if (isEmpty(filteredCategories)) {
      return <Splash>{t("errorText_emptyCategories")}</Splash>;
    }

    return (
      <>
        <div>
          {categories.length > 0 && (
            <Group>
              <Grid>
                {categories.map((category) => (
                  <Link key={category.id} to={`/categories/${category.id}`}>
                    <CategoryCard
                      category={category}
                      isPinned={pinnedCategories.includes(category.id)}
                      onTogglePinClick={() => toggle(category.id)}
                    />
                  </Link>
                ))}
              </Grid>
            </Group>
          )}

          <Group>
            <Grid>
              {filteredCategories.map((category) => (
                <Link key={category.id} to={`/categories/${category.id}`}>
                  <CategoryCard
                    category={category}
                    isPinned={pinnedCategories.includes(category.id)}
                    onTogglePinClick={() => toggle(category.id)}
                  />
                </Link>
              ))}
            </Grid>
          </Group>
        </div>

        {topResponse.hasMore && (
          <LoadMore>
            <MoreButton isLoading={topResponse.isValidating} fetchMore={topResponse.fetchMore}>
              {t("buttonText_loadMore")}
            </MoreButton>
          </LoadMore>
        )}
      </>
    );
  }, [categories, filteredCategories, pinnedResponse, topResponse]);

  return (
    <Wrapper>
      <Header>
        <SearchInput
          onChange={setSearchQuery}
          actionButtons={[
            {
              children: <RefreshIcon isSpinning={topResponse.isValidating} />,
              onClick: () => topResponse.refresh(),
            },
          ]}
        />
      </Header>

      {children}
    </Wrapper>
  );
};

export default TopCategories;
