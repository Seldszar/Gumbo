import { FloatingPortal } from "@floating-ui/react";
import { ReactNode } from "react";
import { useLockBodyScroll } from "react-use";

import { styled } from "~/browser/styled-system/jsx";

const Wrapper = styled("div", {
  base: {
    bg: "black/90",
    display: "grid",
    inset: 0,
    overflow: "auto",
    pos: "fixed",
    zIndex: 20,
  },
});

const Inner = styled("div", {
  base: {
    m: "auto",
    maxW: "xl",
    p: 6,
    w: "full",
  },
});

export interface ModalProps {
  children?: ReactNode;
}

function Modal(props: ModalProps) {
  useLockBodyScroll(true);

  return (
    <FloatingPortal id="modal-root">
      <Wrapper>
        <Inner>{props.children}</Inner>
      </Wrapper>
    </FloatingPortal>
  );
}

export default Modal;
