import { ReactNode } from "react";

import { styled } from "~/browser/styled-system/jsx";

import Spinner from "./Spinner";

const Wrapper = styled("div", {
  base: {
    display: "grid",
    flex: 1,
    gap: 4,
    h: "full",
    placeContent: "center",
  },
});

const StyledSpinner = styled(Spinner, {
  base: {
    mx: "auto",
    w: 8,
  },
});

const Inner = styled("div", {
  base: {
    fontSize: "lg",
    textAlign: "center",
  },
});

export interface SplashProps {
  children?: ReactNode;
  className?: string;
  isLoading?: boolean;
}

function Splash(props: SplashProps) {
  return (
    <Wrapper>
      {props.isLoading && <StyledSpinner />}
      {props.children && <Inner>{props.children}</Inner>}
    </Wrapper>
  );
}

export default Splash;
