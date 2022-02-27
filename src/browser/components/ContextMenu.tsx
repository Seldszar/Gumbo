import { flip, offset, Placement, shift, useFloating } from "@floating-ui/react-dom";
import { useDomEvent } from "framer-motion";
import React, { FC, ReactNode, Ref } from "react";
import { createPortal } from "react-dom";
import { useClickAway, useToggle } from "react-use";
import tw, { styled, theme } from "twin.macro";

import Menu, { MenuProps } from "./Menu";

const Panel = styled.div`
  ${tw`fixed bg-black py-2 rounded shadow-lg z-20`}

  max-width: ${theme<string>("spacing.64")};
  min-width: ${theme<string>("spacing.48")};
`;

interface ContextMenu {
  children(ref: Ref<never>): ReactNode;
  menu: MenuProps;
  placement?: Placement;
}

const ContextMenu: FC<ContextMenu> = (props) => {
  const [isOpen, toggleOpen] = useToggle(false);

  const { floating, reference, refs, x, y } = useFloating({
    middleware: [flip(), shift(), offset(4)],
    placement: props.placement,
    strategy: "fixed",
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
    event.preventDefault();

    toggleOpen();
  });

  useDomEvent(refs.floating, "click", () => {
    toggleOpen(false);
  });

  const children = (
    <>
      {isOpen && (
        <Panel ref={floating} style={{ top: y ?? "", left: x ?? "" }}>
          <Menu {...props.menu} />
        </Panel>
      )}
    </>
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
