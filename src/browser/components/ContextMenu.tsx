import { flip, offset, Placement, shift, size, useFloating } from "@floating-ui/react-dom";
import { AnimatePresence, m, useDomEvent, Variants } from "framer-motion";
import React, { FC, ReactNode, Ref } from "react";
import { createPortal } from "react-dom";
import { useClickAway, useToggle } from "react-use";
import tw, { styled, theme } from "twin.macro";

import Menu, { MenuProps } from "./Menu";

interface PanelProps {
  fullWidth?: boolean;
}

const Panel = styled(m.div)<PanelProps>`
  ${tw`fixed bg-white dark:bg-black max-h-80 py-2 rounded shadow-lg z-20`}

  max-width: ${theme<string>("spacing.64")};
  min-width: ${theme<string>("spacing.48")};

  ${(props) => props.fullWidth && tw`max-w-none min-w-0`}
`;

const panelVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.1,
    },
  },
};

interface ContextMenu {
  children(ref: Ref<never>): ReactNode;
  menu: MenuProps;
  placement?: Placement;
  fullWidth?: boolean;
}

const ContextMenu: FC<ContextMenu> = (props) => {
  const [isOpen, toggleOpen] = useToggle(false);

  const { floating, reference, refs, x, y } = useFloating<Element>({
    placement: props.placement,
    strategy: "fixed",
    middleware: [
      flip(),
      shift(),
      offset(4),
      size({
        apply({ reference }) {
          if (!props.fullWidth) {
            return;
          }

          const element = refs.floating.current;

          if (element == null) {
            return;
          }

          Object.assign(element.style, {
            width: `${reference.width}px`,
          });
        },
      }),
    ],
  });

  useClickAway(
    refs.floating,
    (event) => {
      const target = event.target as Element;
      const node = refs.reference.current;

      if (event.type === "click" && (target === node || node?.contains(target))) {
        return;
      }

      toggleOpen(false);
    },
    ["click", "contextmenu"]
  );

  useDomEvent(refs.reference, "click", (event) => {
    event.stopPropagation();
    event.preventDefault();

    toggleOpen();
  });

  useDomEvent(refs.floating, "click", () => {
    toggleOpen(false);
  });

  const children = (
    <AnimatePresence initial={false}>
      {isOpen && (
        <Panel
          fullWidth={props.fullWidth}
          ref={floating}
          style={{ top: y ?? "", left: x ?? "" }}
          variants={panelVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <Menu {...props.menu} />
        </Panel>
      )}
    </AnimatePresence>
  );

  const portal = createPortal(children, document.body);

  return (
    <>
      {props.children(reference)}
      {portal}
    </>
  );
};

export default ContextMenu;
