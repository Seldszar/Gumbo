import { ReactNode } from "react";

import { styled } from "~/browser/styled-system/jsx";

import Loader from "./Loader";
import Scrollable from "./Scrollable";
import TopBar from "./TopBar";

const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDir: "column",
    h: "full",
  },
});

const StyledScrollable = styled(Scrollable, {
  base: {
    flex: 1,
  },
});

const Inner = styled("div", {
  base: {
    display: "flex",
    flex: 1,
    flexDir: "column",
    minH: "full",
  },
});

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
