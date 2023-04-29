import { useMemo } from "react";
import { Outlet, useParams } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";
import { HelixGame } from "~/common/types";

import { useCategory } from "~/browser/hooks";

import CategoryTitle from "~/browser/components/CategoryTitle";
import Splash from "~/browser/components/Splash";
import TopBar from "~/browser/components/TopBar";

const Wrapper = styled.div`
  ${tw`flex flex-col min-h-full`}
`;

const Title = styled(CategoryTitle)`
  ${tw`flex-none`}
`;

export interface OutletContext {
  category: HelixGame;
}

function CategoryDetail() {
  const params = useParams();

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

        <Outlet context={{ category }} />
      </>
    );
  }, [category, isLoading]);

  return (
    <Wrapper>
      <TopBar />

      {children}
    </Wrapper>
  );
}

export default CategoryDetail;
