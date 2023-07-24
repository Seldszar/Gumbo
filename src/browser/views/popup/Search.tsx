import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import Layout from "~/browser/components/Layout";

const TabList = styled.div`
  ${tw`flex`}
`;

const Tab = styled(NavLink)`
  ${tw`border-b border-neutral-200 dark:border-neutral-800 flex-1 py-3 relative text-center text-neutral-600 dark:text-neutral-400 [&.active]:(border-purple-500 font-medium text-black dark:text-white)!`}
`;

export interface OutletContext {
  searchQuery: string;
}

export function Component() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Layout searchQuery={searchQuery} onSearchQueryChange={setSearchQuery}>
      <TabList>
        <Tab to="channels">{t("titleText_channels")}</Tab>
        <Tab to="categories">{t("titleText_categories")}</Tab>
      </TabList>

      <Outlet context={{ searchQuery }} />
    </Layout>
  );
}

export default Component;
