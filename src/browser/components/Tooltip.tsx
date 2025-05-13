import { Tooltip as TooltipPrimitive } from "radix-ui";
import { ReactNode } from "react";

import { styled } from "~/browser/styled-system/jsx";

const Content = styled(TooltipPrimitive.Content, {
  base: {
    bg: { base: "white", _dark: "black" },
    fontSize: "sm",
    maxH: "var(--radix-tooltip-content-available-height)",
    maxW: "var(--radix-tooltip-content-available-width)",
    pointerEvents: "none",
    pos: "fixed",
    px: 4,
    py: 2,
    rounded: "sm",
    shadow: "lg",
    zIndex: 20,
  },
});

interface TooltipProps {
  align?: "end" | "start" | "center";
  side?: "bottom" | "left" | "right" | "top";

  children: ReactNode;
  title?: ReactNode;
}

function Tooltip(props: TooltipProps) {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{props.children}</TooltipPrimitive.Trigger>

        <TooltipPrimitive.Portal>
          <Content align={props.align} side={props.side} sideOffset={2}>
            {props.title}
          </Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

export default Tooltip;
