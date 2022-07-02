import React, { FC, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { t } from "@/common/helpers";

import SearchInput from "@/browser/components/SearchInput";

const Wrapper = styled.div`
  ${tw`flex flex-col min-h-full`}
`;

const Header = styled.div`
  ${tw`bg-gradient-to-b from-neutral-100 via-neutral-100 dark:(from-neutral-900 via-neutral-900) to-transparent flex-none p-3 sticky top-0 z-20`}
`;

const TabList = styled.div`
  ${tw`bg-white dark:bg-black flex flex-none -mt-20 pt-24 px-4`}
`;

const Tab = styled(NavLink)`
  ${tw`flex-auto px-4 py-2 rounded-t text-center hover:(text-black dark:text-white)`}

  &.active {
    ${tw`(bg-neutral-100 dark:bg-neutral-900 text-purple-500)!`}
  }
`;

const Search: FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Wrapper>
      <Header>
        <SearchInput onChange={setSearchQuery} />
      </Header>

      <TabList>
        <Tab to="channels">{t("titleText_channels")}</Tab>
        <Tab to="categories">{t("titleText_categories")}</Tab>
      </TabList>

      <Outlet context={{ searchQuery }} />
    </Wrapper>
  );
};

export default Search;
