import { ScrollArea } from "radix-ui";
import { ReactNode } from "react";

import { styled } from "../styled-system/jsx";

const StyledRoot = styled(ScrollArea.Root, {
  base: {
    display: "grid",
    overflow: "hidden",
  },
});

const StyledViewport = styled(ScrollArea.Viewport, {
  base: {
    pos: "relative",
  },
});

const StyledScrollbar = styled(ScrollArea.Scrollbar, {
  base: {
    display: "flex",

    _horizontal: {
      h: 2,
    },

    _vertical: {
      w: 2,
    },
  },
});

const StyledThumb = styled(ScrollArea.Thumb, {
  base: {
    bg: {
      _dark: { base: "white/25", _hover: "white/50", _active: "white/75" },
      _light: { base: "black/25", _hover: "black/50", _active: "black/75" },
    },
    flex: 1,
  },
});

export interface ScrollableProps {
  children?: ReactNode;
  className?: string;
}

export function Scrollable(props: ScrollableProps) {
  return (
    <StyledRoot className={props.className}>
      <StyledViewport>{props.children}</StyledViewport>

      <StyledScrollbar>
        <StyledThumb />
      </StyledScrollbar>
    </StyledRoot>
  );
}

export default Scrollable;
