import {
  FloatingPortal,
  Placement,
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
  useHover,
  useInteractions,
  useMergeRefs,
} from "@floating-ui/react";
import { ReactElement, ReactNode, cloneElement, useState } from "react";
import tw, { styled } from "twin.macro";

import { remToPixels } from "../helpers";

const Panel = styled.div`
  ${tw`fixed bg-purple-500 max-w-full pointer-events-none px-4 py-2 rounded shadow-lg text-white z-20`}
`;

interface TooltipProps {
  children: ReactElement;
  placement?: Placement;
  content?: ReactNode;
}

function Tooltip(props: TooltipProps) {
  const [isOpen, setOpen] = useState(false);

  const { context, floatingStyles, refs } = useFloating({
    open: isOpen,
    strategy: "fixed",
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    placement: props.placement,
    middleware: [
      flip(),
      shift({
        padding: remToPixels(0.5),
      }),
      size({
        padding: remToPixels(0.5),
        apply({ availableHeight, availableWidth, elements }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${availableHeight}px`,
            maxWidth: `${availableWidth}px`,
          });
        },
      }),
      offset(remToPixels(0.25)),
    ],
  });

  const hover = useHover(context, {
    enabled: !!props.content,
    delay: {
      open: 500,
    },
  });

  const { getFloatingProps, getReferenceProps } = useInteractions([hover]);

  return (
    <>
      {cloneElement(props.children, {
        ...getReferenceProps(),
        ref: useMergeRefs([refs.setReference, (props.children as any).ref]),
      })}

      {isOpen && (
        <FloatingPortal id="modal-root">
          <Panel ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
            {props.content}
          </Panel>
        </FloatingPortal>
      )}
    </>
  );
}

export default Tooltip;
