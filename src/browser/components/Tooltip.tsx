import {
  FloatingPortal,
  autoPlacement,
  offset,
  useFloating,
  useHover,
  useInteractions,
  useMergeRefs,
} from "@floating-ui/react";
import { ReactElement, ReactNode, cloneElement, useState } from "react";
import tw, { styled } from "twin.macro";

const Panel = styled.div`
  ${tw`fixed bg-purple-500 max-w-full pointer-events-none px-4 py-2 rounded shadow-lg text-white z-20`}
`;

interface TooltipProps {
  children: ReactElement;
  content?: ReactNode;
}

function Tooltip(props: TooltipProps) {
  const [isOpen, setOpen] = useState(false);

  const { context, floatingStyles, refs } = useFloating({
    middleware: [autoPlacement(), offset(4)],
    onOpenChange: setOpen,
    strategy: "fixed",
    open: isOpen,
  });

  const hover = useHover(context, {
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
