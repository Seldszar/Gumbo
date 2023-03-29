import { FC } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import Logo from "./Logo";
import ProfileBadge from "./ProfileBadge";
import SidebarLink from "./SidebarLink";

const Wrapper = styled.div`
  ${tw`ltr:bg-gradient-to-r rtl:bg-gradient-to-l grid gap-8 content-between from-transparent overflow-x-hidden overflow-y-scroll to-black/10 dark:to-black/20 w-16`}

  scrollbar-width: none;

  &::-webkit-scrollbar {
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

const StyledLink = styled(SidebarLink)``;

const Footer = styled.div`
  ${tw`grid p-3 place-content-center`}
`;

export interface SidebarProps {
  className?: string;
  user: any;
}

const Sidebar: FC<SidebarProps> = (props) => (
  <Wrapper className={props.className}>
    <Header>
      <StyledLogo />
    </Header>
    <Inner>
      <StyledLink title={t("titleText_followedStreams")} to="/streams/followed">
        <svg viewBox="0 0 24 24">
          <path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
        </svg>
      </StyledLink>
      <StyledLink title={t("titleText_followedUsers")} to="/users/followed">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="7" r="4" />
          <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
        </svg>
      </StyledLink>
      <Separator />
      <StyledLink title={t("titleText_topStreams")} to="/streams" end>
        <svg viewBox="0 0 24 24">
          <path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z" />
          <rect x="3" y="6" width="12" height="12" rx="2" />
        </svg>
      </StyledLink>
      <StyledLink title={t("titleText_topCategories")} to="/categories">
        <svg viewBox="0 0 24 24">
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <rect x="14" y="14" width="6" height="6" rx="1" />
        </svg>
      </StyledLink>
      <Separator />
      <StyledLink title={t("titleText_search")} to="/search">
        <svg viewBox="0 0 24 24">
          <circle cx="10" cy="10" r="7" />
          <line x1="21" y1="21" x2="15" y2="15" />
        </svg>
      </StyledLink>
    </Inner>
    <Footer>
      <StyledProfileBadge user={props.user} />
    </Footer>
  </Wrapper>
);

export default Sidebar;
