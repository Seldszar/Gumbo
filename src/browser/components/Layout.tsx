import { ReactNode } from "react";
import tw, { styled } from "twin.macro";

import Loader from "~/browser/components/Loader";
import Scrollable from "~/browser/components/Scrollable";
import TopBar from "~/browser/components/TopBar";

const Wrapper = styled.div`
  ${tw`flex flex-col h-full`}
`;

const StyledScrollable = styled(Scrollable)`
  ${tw`flex-1`}
`;

const Inner = styled.div`
  ${tw`flex flex-1 flex-col min-h-full`}
`;

export interface LayoutProps {
  searchQuery?: string;

  children?: ReactNode;
  className?: string;

  onSearchQueryChange?(value: string): void;
}

function Layout(props: LayoutProps) {
  return (
    <Wrapper className={props.className}>
      <TopBar searchQuery={props.searchQuery} onSearchQueryChange={props.onSearchQueryChange} />

      <StyledScrollable>
        <Inner>
          <Loader>{props.children}</Loader>
        </Inner>
      </StyledScrollable>
    </Wrapper>
  );
}

export default Layout;
