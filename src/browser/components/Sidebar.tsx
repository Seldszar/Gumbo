import { IconCategory, IconHeart, IconSearch, IconUser, IconVideo } from "@tabler/icons-react";

import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";
import { CurrentUser } from "~/common/types";

import Logo from "./Logo";
import ProfileBadge from "./ProfileBadge";
import SidebarLink from "./SidebarLink";

const Wrapper = styled.div`
  ${tw`ltr:bg-gradient-to-r rtl:bg-gradient-to-l grid gap-8 content-between from-transparent overflow-x-hidden overflow-y-scroll to-black/10 dark:to-black/20 w-16`}

  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const Header = styled.div`
  ${tw`grid p-4 place-content-center`}
`;

const StyledLogo = styled(Logo)`
  ${tw`w-8`}
`;

const StyledProfileBadge = styled(ProfileBadge)`
  ${tw`flex-none self-center`}
`;

const Inner = styled.div`
  ${tw`gap-3 grid place-content-center`}
`;

const Separator = styled.hr`
  ${tw`border-black/10 dark:border-white/10 m-1`}
`;

const Footer = styled.div`
  ${tw`grid p-3 place-content-center`}
`;

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
