import { NavLink, Outlet } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

const Wrapper = styled.div`
  ${tw`flex gap-6 items-start max-w-2xl w-full`}
`;

const Aside = styled.div`
  ${tw`flex-shrink-0 grid gap-4 sticky top-6 w-64`}
`;

const MenuItem = styled(NavLink)`
  ${tw`block text-neutral-600 text-lg hover:text-black dark:(text-neutral-400 hover:text-white)`}

  &.active {
    ${tw`text-purple-500!`}
  }
`;

const Inner = styled.div`
  ${tw`flex-1`}
`;

function Root() {
  return (
    <Wrapper>
      <Aside>
        <MenuItem to="general">{t("titleText_general")}</MenuItem>
        <MenuItem to="badge">{t("titleText_badge")}</MenuItem>
        <MenuItem to="notification">{t("titleText_notifications")}</MenuItem>
        <MenuItem to="search">{t("titleText_search")}</MenuItem>
        <MenuItem to="stream">{t("titleText_streams")}</MenuItem>
        <MenuItem to="advanced">{t("titleText_advanced")}</MenuItem>
      </Aside>

      <Inner>
        <Outlet />
      </Inner>
    </Wrapper>
  );
}

export default Root;
