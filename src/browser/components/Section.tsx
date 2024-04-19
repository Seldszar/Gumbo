import { ReactNode } from "react";

import { styled } from "~/browser/styled-system/jsx";

const Header = styled("div", {
  base: {
    color: { base: "neutral.600", _dark: "neutral.400" },
    fontSize: "sm",
    fontWeight: "medium",
    mb: 2,
    textTransform: "uppercase",
  },
});

const Wrapper = styled("div", {
  base: {
    mb: { base: 6, _last: 0 },

    "& p": {
      mb: { base: 2, _last: 0 },
    },
  },
});

interface Props {
  children?: ReactNode;
  className?: string;
  title?: ReactNode;
}

function Section(props: Props) {
  return (
    <Wrapper className={props.className}>
      {props.title && <Header>{props.title}</Header>}
      {props.children}
    </Wrapper>
  );
}

export default Section;
