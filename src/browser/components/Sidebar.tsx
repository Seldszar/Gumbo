import { IconCategory, IconHeart, IconSearch, IconUser, IconVideo } from "@tabler/icons-react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";
import { CurrentUser } from "~/common/types";

import Logo from "./Logo";
import ProfileBadge from "./ProfileBadge";
import SidebarLink from "./SidebarLink";

const Wrapper = styled.div`
  ${tw`bg-black/10 dark:bg-black/20 grid gap-8 content-between overflow-x-hidden overflow-y-scroll w-16`}

  scrollbar-width: none;

  ::-webkit-scrollbar {
    ${tw`hidden`}
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
  ${tw`border-neutral-200 dark:border-neutral-800 m-1`}
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
