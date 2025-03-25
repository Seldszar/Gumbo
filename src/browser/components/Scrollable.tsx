import { ScrollArea } from "radix-ui";
import { ReactNode } from "react";
import tw, { styled } from "twin.macro";

const StyledRoot = styled(ScrollArea.Root)`
  ${tw`grid overflow-hidden`}
`;

const StyledViewport = styled(ScrollArea.Viewport)`
  ${tw`relative`}
`;

const StyledScrollbar = styled(ScrollArea.Scrollbar)`
  ${tw`flex data-[orientation=horizontal]:h-[4px] data-[orientation=vertical]:w-[4px]`}
`;

const StyledThumb = styled(ScrollArea.Thumb)`
  ${tw`flex-1 relative bg-black/25 hover:bg-black/50 active:bg-black/75 dark:(bg-white/25 hover:bg-white/50 active:bg-white/75)`}
`;

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
