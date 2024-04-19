import { IconCategory, IconHeart, IconSearch, IconUser, IconVideo } from "@tabler/icons-react";

import { t } from "~/common/helpers";
import { CurrentUser } from "~/common/types";

import { styled } from "~/browser/styled-system/jsx";

import Logo from "./Logo";
import ProfileBadge from "./ProfileBadge";
import SidebarLink from "./SidebarLink";

const Wrapper = styled("div", {
  base: {
    bg: { base: "black/10", _dark: "black/20" },
    display: "flex",
    flexDir: "column",
    gap: 8,
    justifyContent: "space-between",
    overflowX: "hidden",
    overflowY: "scroll",
    scrollbarWidth: "none",
    w: 16,
  },
});

const Header = styled("div", {
  base: {
    display: "grid",
    flex: "none",
    p: 4,
    placeContent: "center",
  },
});

const StyledLogo = styled(Logo, {
  base: {
    w: 8,
  },
});

const StyledProfileBadge = styled(ProfileBadge, {
  base: {
    alignSelf: "center",
    flex: "none",
  },
});

const Inner = styled("div", {
  base: {
    display: "grid",
    flex: 1,
    gap: 3,
    placeContent: "center",
  },
});

const Separator = styled("hr", {
  base: {
    borderColor: { base: "neutral.200", _dark: "neutral.800" },
    m: 1,
  },
});

const Footer = styled("div", {
  base: {
    display: "grid",
    flex: "none",
    p: 3,
    placeContent: "center",
  },
});

export interface SidebarProps {
  className?: string;
  user: CurrentUser;
}

function Sidebar(props: SidebarProps) {
  return (
    <Wrapper className={props.className}>
      <Header>
        <StyledLogo />
      </Header>
      <Inner>
        <SidebarLink title={t("titleText_followedStreams")} to="/streams/followed">
          <IconHeart size="1.5rem" />
        </SidebarLink>
        <SidebarLink title={t("titleText_followedUsers")} to="/users/followed">
          <IconUser size="1.5rem" />
        </SidebarLink>
        <Separator />
        <SidebarLink title={t("titleText_topStreams")} to="/streams" end>
          <IconVideo size="1.5rem" />
        </SidebarLink>
        <SidebarLink title={t("titleText_topCategories")} to="/categories">
          <IconCategory size="1.5rem" />
        </SidebarLink>
        <Separator />
        <SidebarLink title={t("titleText_search")} to="/search">
          <IconSearch size="1.5rem" />
        </SidebarLink>
      </Inner>
      <Footer>
        <StyledProfileBadge user={props.user} />
      </Footer>
    </Wrapper>
  );
}

export default Sidebar;
