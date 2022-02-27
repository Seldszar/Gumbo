import React, { FC } from "react";
import tw, { styled } from "twin.macro";

import Logo from "./Logo";
import ProfileBadge from "./ProfileBadge";
import SidebarLink from "./SidebarLink";

const Wrapper = styled.div`
  ${tw`bg-gradient-to-r grid content-between from-transparent to-black/20 w-16`}
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
  ${tw`border-white/10 m-1`}
`;

const StyledLink = styled(SidebarLink)``;

const Footer = styled.div`
  ${tw`grid p-3 place-content-center`}
`;

export interface SidebarProps {
  user: any;
}

const Sidebar: FC<SidebarProps> = (props) => (
  <Wrapper>
    <Header>
      <StyledLogo />
    </Header>
    <Inner>
      <StyledLink title="Followed Streams" to="/streams/followed">
        <svg viewBox="0 0 24 24">
          <path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
        </svg>
      </StyledLink>
      <Separator />
      <StyledLink title="Top Streams" to="/streams" end>
        <svg viewBox="0 0 24 24">
          <path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z" />
          <rect x="3" y="6" width="12" height="12" rx="2" />
        </svg>
      </StyledLink>
      <StyledLink title="Top Categories" to="/categories">
        <svg viewBox="0 0 24 24">
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <rect x="14" y="14" width="6" height="6" rx="1" />
        </svg>
      </StyledLink>
      <Separator />
      <StyledLink title="Search" to="/search">
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
