import { Global } from "@emotion/react";
import { AnimatePresence, m, Variants } from "framer-motion";
import React, { ReactNode, FC } from "react";
import { createPortal } from "react-dom";
import tw, { css, styled } from "twin.macro";

import Panel from "./Panel";

const Wrapper = styled(m.div)`
  ${tw`backdrop-blur-md bg-black/50 grid fixed inset-0 overflow-auto z-20`}
`;

const Inner = styled.div`
  ${tw`m-auto w-full`}
`;

const StyledPanel = styled(Panel)`
  ${tw`m-6`}
`;

const wrapperVariants: Variants = {
  hide: {
    opacity: 0,
    transition: {
      duration: 0.25,
    },
  },
  show: {
    opacity: 1,
    transition: {
      duration: 0.25,
    },
  },
};

export interface ModalProps {
  title?: ReactNode;
  children?: ReactNode;
  isOpen?: boolean;
  onClose?(): void;
}

const Modal: FC<ModalProps> = (props) => {
  const children = (
    <AnimatePresence initial={false}>
      {props.isOpen && (
        <Wrapper variants={wrapperVariants} initial="hide" animate="show" exit="hide">
          <Global
            styles={css`
              body {
                ${tw`overflow-hidden`}
              }
            `}
          />

          <Inner>
            <StyledPanel title={props.title} onClose={props.onClose}>
              {props.children}
            </StyledPanel>
          </Inner>
        </Wrapper>
      )}
    </AnimatePresence>
  );

  return createPortal(children, document.body);
};

export default Modal;
