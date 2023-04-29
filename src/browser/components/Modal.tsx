import { Global } from "@emotion/react";
import { AnimatePresence, m, Variants } from "framer-motion";
import { ReactNode } from "react";
import { createPortal } from "react-dom";
import tw, { css, styled } from "twin.macro";

const Wrapper = styled(m.div)`
  ${tw`backdrop-blur-md bg-black/50 grid fixed inset-0 overflow-auto z-20`}
`;

const Inner = styled(m.div)`
  ${tw`m-auto p-6 w-full`}
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

const innerVariants: Variants = {
  hide: {
    scale: 0.9,
    transition: {
      duration: 0.25,
    },
  },
  show: {
    scale: 1,
    transition: {
      duration: 0.25,
    },
  },
};

export interface ModalProps {
  children?: ReactNode;
  isOpen?: boolean;
}

function Modal(props: ModalProps) {
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

          <Inner variants={innerVariants}>{props.children}</Inner>
        </Wrapper>
      )}
    </AnimatePresence>
  );

  return createPortal(children, document.body);
}

export default Modal;
