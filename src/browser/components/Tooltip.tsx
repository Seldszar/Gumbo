import { autoPlacement, offset, useFloating } from "@floating-ui/react-dom";
import { AnimatePresence, m, Variants } from "framer-motion";
import { ReactNode, Ref } from "react";
import { createPortal } from "react-dom";
import tw, { styled } from "twin.macro";

import { useHover } from "../hooks";

const Panel = styled(m.div)`
  ${tw`fixed bg-purple-500 max-w-full pointer-events-none px-4 py-2 rounded shadow-lg text-white z-20`}
`;

const panelVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.05,
    },
  },
};

interface ContextMenu {
  children(ref: Ref<never>): ReactNode;
  content?: ReactNode;
}

function Tooltip(props: ContextMenu) {
  const { floating, reference, refs, x, y } = useFloating<Element>({
    middleware: [autoPlacement(), offset(4)],
    strategy: "fixed",
  });

  const isHovering = useHover(refs.reference);

  const children = (
    <AnimatePresence initial={false}>
      {isHovering && (
        <Panel
          ref={floating}
          style={{ top: y ?? "", left: x ?? "" }}
          variants={panelVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {props.content}
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
}

export default Tooltip;
