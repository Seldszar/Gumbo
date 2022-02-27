import { autoPlacement, offset, useFloating } from "@floating-ui/react-dom";
import React, { FC, ReactNode, Ref } from "react";
import { createPortal } from "react-dom";
import { useHoverDirty } from "react-use";
import tw, { styled } from "twin.macro";

const Panel = styled.div`
  ${tw`fixed bg-purple-500 max-w-full pointer-events-none px-4 py-2 rounded shadow-lg z-20`}
`;

interface ContextMenu {
  children(ref: Ref<never>): ReactNode;
  content?: ReactNode;
}

const Tooltip: FC<ContextMenu> = (props) => {
  const { floating, reference, refs, x, y } = useFloating({
    middleware: [autoPlacement(), offset(4)],
    strategy: "fixed",
  });

  const isHovering = useHoverDirty(refs.reference);

  const children = (
    <>
      {isHovering && (
        <Panel ref={floating} style={{ top: y ?? "", left: x ?? "" }}>
          {props.content}
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

export default Tooltip;
