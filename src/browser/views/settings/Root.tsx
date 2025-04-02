import { NavLink, Outlet } from "react-router";
import { useTitle } from "react-use";

import { t } from "~/common/helpers";

import { styled } from "~/browser/styled-system/jsx";

import Logo from "~/browser/components/Logo";
import Wordmark from "~/browser/components/Wordmark";

const Inner = styled("div", {
  base: {
    alignItems: "start",
    display: "flex",
    gap: "6",
    padding: "6",
  },
});

const Aside = styled("div", {
  base: {
    display: "grid",
    flex: "none",
    gap: 4,
    position: "sticky",
    top: 6,
    width: 64,
  },
});

const MenuItem = styled(NavLink, {
  base: {
    color: { base: "neutral.600", _dark: "neutral.400" },
    display: "block",
    fontSize: "lg",

    _hover: {
      color: { base: "black", _dark: "white" },
    },

    "&.active": {
      color: "purple.500",
    },
  },
});

const Header = styled("div", {
  base: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: { base: "neutral.200", _dark: "neutral.800" },
    display: "flex",
    p: 6,
  },
});

const StyledLogo = styled(Logo, {
  base: {
    flex: "none",
    height: 8,
  },
});

const StyledWordmark = styled(Wordmark, {
  base: {
    flex: "none",
    height: 6,
    marginInlineStart: 2,
  },
});

const Divider = styled("div", {
  base: {
    color: { base: "neutral.600", _dark: "neutral.400" },
    mx: 6,
  },
});

const Title = styled("div", {
  base: {
    flex: 1,
    fontSize: "xl",
    fontWeight: "md",
  },
});

const Body = styled("div", {
  base: {
    flex: 1,
    maxW: "sm",
    w: "full",
  },
});

export function Component() {
  useTitle(`${t("titleText_settings")} ━ ${t("extensionName")}`);

  return (
    <div>
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
    </div>
  );
}
