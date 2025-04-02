import { useState } from "react";
import { NavLink, Outlet } from "react-router";

import { t } from "~/common/helpers";

import { styled } from "~/browser/styled-system/jsx";

import Layout from "~/browser/components/Layout";

const TabList = styled("div", {
  base: {
    display: "flex",
  },
});

const Tab = styled(NavLink, {
  base: {
    borderBottomWidth: 1,
    borderColor: { base: "neutral.200", _dark: "neutral.800" },
    color: { base: "neutral.600", _dark: "neutral.400" },
    flex: 1,
    pos: "relative",
    py: 3,
    textAlign: "center",

    "&.active": {
      borderColor: "purple.500",
      color: { base: "black", _dark: "white" },
      fontWeight: "medium",
    },
  },
});

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
