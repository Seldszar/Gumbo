import { ReactNode } from "react";

import { styled } from "~/browser/styled-system/jsx";

const Ornament = styled("div", {
  base: {
    flex: "none",
  },
});

const Inner = styled("div", {
  base: {
    flex: 1,
    overflow: "hidden",
  },
});

const Title = styled("div", {
  base: {
    fontWeight: "medium",
    truncate: true,
  },
});

const Subtitle = styled("div", {
  base: {
    color: { base: "neutral.600", _dark: "neutral.400" },
    fontSize: "sm",
    truncate: true,
  },
});

const Body = styled("div", {
  base: {
    color: { base: "neutral.600", _dark: "neutral.400" },
    fontSize: "sm",
  },
});

const Wrapper = styled("div", {
  base: {
    alignItems: "center",
    display: "flex",
    gap: 4,
    px: 4,

    _hover: {
      bg: { base: "neutral.200", _dark: "neutral.800" },
    },
  },
});

export interface CardProps {
  children?: ReactNode;
  className?: string;

  title?: ReactNode;
  subtitle?: ReactNode;

  leftOrnament?: ReactNode;
  rightOrnament?: ReactNode;
}

function Card(props: CardProps) {
  return (
    <Wrapper className={props.className}>
      {props.leftOrnament && <Ornament>{props.leftOrnament}</Ornament>}

      <Inner>
        {props.title && <Title>{props.title}</Title>}
        {props.subtitle && <Subtitle>{props.subtitle}</Subtitle>}

        <Body>{props.children}</Body>
      </Inner>

      {props.rightOrnament && <Ornament>{props.rightOrnament}</Ornament>}
    </Wrapper>
  );
}

export default Card;
