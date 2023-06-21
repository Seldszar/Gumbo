import { Global } from "@emotion/react";
import { FloatingPortal } from "@floating-ui/react";
import { ReactNode } from "react";
import tw, { css, styled } from "twin.macro";

const Wrapper = styled.div`
  ${tw`bg-black/90 grid fixed inset-0 overflow-auto z-20`}
`;

const Inner = styled.div`
  ${tw`m-auto max-w-xl p-6 w-full`}
`;

export interface ModalProps {
  children?: ReactNode;
}

function Modal(props: ModalProps) {
  return (
    <FloatingPortal id="modal-root">
      <Global
        styles={css`
          body {
            ${tw`overflow-hidden`}
          }
        `}
      />

      <Wrapper>
        <Inner>{props.children}</Inner>
      </Wrapper>
    </FloatingPortal>
  );
}

export default Modal;
