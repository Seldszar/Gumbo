import { sortBy } from "lodash-es";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import { useRefreshHandler } from "~/browser/contexts";
import { isEmpty } from "~/browser/helpers";
import { useCategories, usePinnedCategories, useTopCategories } from "~/browser/hooks";

import CategoryCard from "~/browser/components/cards/CategoryCard";

import MoreButton from "~/browser/components/MoreButton";
import Splash from "~/browser/components/Splash";
import TopBar from "~/browser/components/TopBar";

const Wrapper = styled.div`
  ${tw`flex flex-col min-h-full`}
`;

const Group = styled.div`
  ${tw`after:(block border-b border-neutral-200 content-[''] mx-4 my-1 dark:border-neutral-800) last:after:hidden`}
`;

const Grid = styled.div`
  ${tw`gap-x-2 gap-y-4 grid grid-cols-4 p-3`}
`;

const LoadMore = styled.div`
  ${tw`p-3 pt-0`}
`;

function TopCategories() {
  const [pinnedCategories, { toggle }] = usePinnedCategories();

  const [categories = [], pinnedResponse] = useCategories({
    id: pinnedCategories,
  });

  const [topCategories = [], topResponse] = useTopCategories({
    first: 100,
  });

  const sortedCategories = useMemo(() => sortBy(categories, "name"), [categories]);

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

    if (isEmpty(topCategories)) {
      return <Splash>{t("errorText_emptyCategories")}</Splash>;
    }

    return (
      <>
        <div>
          {sortedCategories.length > 0 && (
            <Group>
              <Grid>
                {sortedCategories.map((category) => (
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
              {topCategories.map((category) => (
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
  }, [categories, pinnedResponse, topCategories, topResponse]);

  useRefreshHandler(async () => {
    await topResponse.refresh();
  });

  return (
    <Wrapper>
      <TopBar />

      {children}
    </Wrapper>
  );
}

export default TopCategories;
