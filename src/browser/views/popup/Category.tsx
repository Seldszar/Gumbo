import { Outlet, useParams } from "react-router";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";
import { HelixGame } from "~/common/types";

import { useCategory } from "~/browser/hooks";

import CategoryTitle from "~/browser/components/CategoryTitle";
import Layout from "~/browser/components/Layout";
import Splash from "~/browser/components/Splash";

const Title = styled(CategoryTitle)`
  ${tw`flex-none`}
`;

export interface OutletContext {
  category: HelixGame;
}

function ChildComponent() {
  const params = useParams();

  const [category] = useCategory(params.categoryId, {
    suspense: true,
  });

  if (category == null) {
    return <Splash>{t("detailText_noCategory")}</Splash>;
  }

  return (
    <>
      <Title category={category} />

      <Outlet
        context={{
          category,
        }}
      />
    </>
  );
}

export function Component() {
  return (
    <Layout>
      <ChildComponent />
    </Layout>
  );
}

export default Component;
