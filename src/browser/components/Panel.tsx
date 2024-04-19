import { IconX } from "@tabler/icons-react";
import { ReactNode, MouseEventHandler } from "react";

import { styled } from "~/browser/styled-system/jsx";

const Wrapper = styled("div", {
  base: {
    bg: { base: "neutral.100", _dark: "neutral.900" },
    pos: "relative",
    px: 6,
    rounded: "sm",
    shadow: "lg",
  },
});

const Header = styled("div", {
  base: {
    alignItems: "start",
    bgGradient: "to-b",
    display: "flex",
    gradientFrom: { base: "neutral.100", _dark: "neutral.900" },
    gradientFromPosition: "50%",
    gradientTo: "transparent",
    pos: "sticky",
    py: 6,
    top: 0,
    zIndex: 10,
  },
});

const Title = styled("div", {
  base: {
    color: "purple.500",
    flex: 1,
    fontSize: "xl",
    fontWeight: "bold",
  },
});

const CloseButton = styled("button", {
  base: {
    color: { base: "black", _dark: "white" },
    flex: "none",
    me: -1,
    mt: -1,
    opacity: { base: 0.5, _hover: 1 },
    p: 1,
  },
});

const Inner = styled("div", {
  base: {
    pb: 6,
  },
});

export interface PanelProps {
  onClose?: MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
  className?: string;
  title?: ReactNode;
}

function Panel(props: PanelProps) {
  return (
    <Wrapper className={props.className}>
      <Header>
        <Title>{props.title}</Title>
        {props.onClose && (
          <CloseButton onClick={props.onClose}>
            <IconX size="1.5rem" />
          </CloseButton>
        )}
      </Header>
      <Inner>{props.children}</Inner>
    </Wrapper>
  );
}

export default Panel;
