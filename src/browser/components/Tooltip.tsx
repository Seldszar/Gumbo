import {
  FloatingPortal,
  autoPlacement,
  offset,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import { HTMLProps, ReactNode, useState } from "react";
import tw, { styled } from "twin.macro";

const Panel = styled.div`
  ${tw`fixed bg-purple-500 max-w-full pointer-events-none px-4 py-2 rounded shadow-lg text-white z-20`}
`;

interface TooltipProps {
  content?: ReactNode;

  children(
    getReferenceProps: (userProps?: HTMLProps<Element>) => Record<string, unknown>
  ): ReactNode;
}

function Tooltip(props: TooltipProps) {
  const [isOpen, setOpen] = useState(false);

  const { context, refs, x, y } = useFloating<Element>({
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
      {props.children((userProps) =>
        getReferenceProps({
          ref: refs.setReference,

          ...userProps,
        })
      )}

      {isOpen && (
        <FloatingPortal>
          <Panel
            {...getFloatingProps({
              children: props.content,
              ref: refs.setFloating,
              style: {
                left: x ?? 0,
                top: y ?? 0,
              },
            })}
          />
        </FloatingPortal>
      )}
    </>
  );
}

export default Tooltip;
