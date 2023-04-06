import { useMemo, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";
import { HelixGame } from "~/common/types";

import { useCategory } from "~/browser/hooks";

import CategoryTitle from "~/browser/components/CategoryTitle";
import SearchInput from "~/browser/components/SearchInput";
import Splash from "~/browser/components/Splash";

const Wrapper = styled.div`
  ${tw`flex flex-col min-h-full`}
`;

const Header = styled.div`
  ${tw`bg-gradient-to-b from-neutral-100 via-neutral-100 dark:(from-neutral-900 via-neutral-900) to-transparent flex-none p-3 sticky top-0 z-20`}
`;

const Title = styled(CategoryTitle)`
  ${tw`flex-none`}
`;

export interface OutletContext {
  category: HelixGame;
  searchQuery: string;
}

function CategoryDetail() {
  const params = useParams();

  const [searchQuery, setSearchQuery] = useState("");

  const [category, { error, isLoading }] = useCategory(params.categoryId);

  const children = useMemo(() => {
    if (isLoading) {
      return <Splash isLoading />;
    }

    if (error) {
      return <Splash>{error.message}</Splash>;
    }

    if (category == null) {
      return <Splash>{t("detailText_noCategory")}</Splash>;
    }

    return (
      <>
        <Title category={category} />

        <Outlet context={{ searchQuery, category }} />
      </>
    );
  }, [category, isLoading, searchQuery]);

  return (
    <Wrapper>
      <Header>
        <SearchInput onChange={setSearchQuery} />
      </Header>

      {children}
    </Wrapper>
  );
}

export default CategoryDetail;
