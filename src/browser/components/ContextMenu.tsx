import {
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  Placement,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { HTMLProps, ReactNode, useState } from "react";
import tw, { styled, theme } from "twin.macro";

import Menu, { MenuProps } from "./Menu";

interface PanelProps {
  fullWidth?: boolean;
}

const Panel = styled.div<PanelProps>`
  ${tw`fixed bg-white dark:bg-black max-h-80 py-2 rounded shadow-lg z-20`}

  max-width: ${theme<string>("spacing.64")};
  min-width: ${theme<string>("spacing.48")};

  ${(props) => props.fullWidth && tw`max-w-none min-w-0`}
`;

interface ContextMenu {
  menu: MenuProps;
  placement?: Placement;
  fullWidth?: boolean;

  children(
    getReferenceProps: (userProps?: HTMLProps<Element>) => Record<string, unknown>
  ): ReactNode;
}

function ContextMenu(props: ContextMenu) {
  const [isOpen, setOpen] = useState(false);

  const { context, refs, x, y } = useFloating<Element>({
    middleware: [
      flip(),
      shift(),
      offset(4),
      size({
        apply({ elements, rects }) {
          if (!props.fullWidth) {
            return;
          }

          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      }),
    ],
    onOpenChange: setOpen,
    placement: props.placement,
    strategy: "fixed",
    open: isOpen,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getFloatingProps, getReferenceProps } = useInteractions([click, dismiss]);

  return (
    <>
      {props.children((userProps) =>
        getReferenceProps({
          onClick: (event) => event.stopPropagation(),
          ref: refs.setReference,

          ...userProps,
        })
      )}

      {isOpen && (
        <FloatingPortal>
          <FloatingFocusManager context={context} initialFocus={-1}>
            <Panel
              {...getFloatingProps({
                children: <Menu {...props.menu} />,
                ref: refs.setFloating,
                style: {
                  left: x ?? 0,
                  top: y ?? 0,
                },
              })}
            />
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}

export default ContextMenu;
