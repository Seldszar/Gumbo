import { NavLink, Outlet } from "react-router";
import { useTitle } from "react-use";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import Logo from "~/browser/components/Logo";
import Wordmark from "~/browser/components/Wordmark";

const Wrapper = styled.div``;

const Inner = styled.div`
  ${tw`flex gap-6 items-start p-6`}
`;

const Aside = styled.div`
  ${tw`flex-shrink-0 grid gap-4 sticky top-6 w-64`}
`;

const MenuItem = styled(NavLink)`
  ${tw`block text-neutral-600 text-lg hover:text-black dark:(text-neutral-400 hover:text-white) [&.active]:text-purple-500!`}
`;

const Header = styled.div`
  ${tw`border-b border-neutral-200 dark:border-neutral-800 flex items-center p-6`}
`;

const StyledLogo = styled(Logo)`
  ${tw`flex-shrink-0 h-8`}
`;

const StyledWordmark = styled(Wordmark)`
  ${tw`flex-shrink-0 h-6 ms-2`}
`;

const Divider = styled.div`
  ${tw`mx-6 text-neutral-600 dark:text-neutral-400`}
`;

const Title = styled.div`
  ${tw`flex-1 font-medium text-xl`}
`;

const Body = styled.div`
  ${tw`flex-1 max-w-sm w-full`}
`;

export function Component() {
  useTitle(`${t("titleText_settings")} ━ ${t("extensionName")}`);

  return (
    <Wrapper>
      <Header>
        <StyledLogo />
        <StyledWordmark />
        <Divider>━</Divider>
        <Title>{t("titleText_settings")}</Title>
      </Header>
      <Inner>
        <Aside>
          <MenuItem to="general">{t("titleText_general")}</MenuItem>
          <MenuItem to="badge">{t("titleText_badge")}</MenuItem>
          <MenuItem to="dropdown-menu">{t("titleText_dropdownMenu")}</MenuItem>
          <MenuItem to="notification">{t("titleText_notifications")}</MenuItem>
          <MenuItem to="stream">{t("titleText_streams")}</MenuItem>
          <MenuItem to="advanced">{t("titleText_advanced")}</MenuItem>
        </Aside>
        <Body>
          <Outlet />
        </Body>
      </Inner>
    </Wrapper>
  );
}
