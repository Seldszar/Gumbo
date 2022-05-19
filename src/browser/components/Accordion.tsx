import { AnimatePresence, m, Variants } from "framer-motion";
import React, { FC, ReactNode } from "react";
import { useToggle } from "react-use";
import tw, { styled } from "twin.macro";

const Wrapper = styled.div`
  ${tw`bg-neutral-200 dark:bg-neutral-800 overflow-hidden rounded shadow-lg`}
`;

interface IconProps {
  isOpen?: boolean;
}

const Icon = styled.svg<IconProps>`
  ${tw`flex-none stroke-current transition w-6`}

  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2px;

  ${(props) => props.isOpen && tw`rotate-90`}
`;

const Header = styled.div`
  ${tw`cursor-pointer flex gap-4 items-center p-4 rounded shadow-lg text-black dark:text-white`}
`;

const Title = styled.div`
  ${tw`flex-1 text-lg`}
`;

const Collapse = styled(m.div)``;

const Inner = styled.div`
  ${tw`p-4`}
`;

const collapseVariants: Variants = {
  hide: {
    height: 0,
    transition: {
      ease: "easeOut",
    },
  },
  show: {
    height: "auto",
    transition: {
      ease: "easeOut",
    },
  },
};

interface AccordionProps {
  children?: ReactNode;
  className?: string;
  title?: ReactNode;
  isOpen?: boolean;
}

const Accordion: FC<AccordionProps> = (props) => {
  const [isOpen, toggleOpen] = useToggle(props.isOpen ?? false);

  return (
    <Wrapper className={props.className}>
      {props.title && (
        <Header onClick={() => toggleOpen()}>
          <Title>{props.title}</Title>
          <Icon viewBox="0 0 24 24" isOpen={isOpen}>
            <polyline points="9 6 15 12 9 18" />
          </Icon>
        </Header>
      )}

      <AnimatePresence initial={false}>
        {isOpen && (
          <Collapse variants={collapseVariants} initial="hide" animate="show" exit="hide">
            <Inner>{props.children}</Inner>
          </Collapse>
        )}
      </AnimatePresence>
    </Wrapper>
  );
};

export default Accordion;
