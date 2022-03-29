import React, { FC, ReactNode } from "react";
import { useToggle } from "react-use";
import tw, { styled } from "twin.macro";

const Wrapper = styled.div`
  ${tw`bg-neutral-800 overflow-hidden rounded shadow-lg`}
`;

const Header = styled.div`
  ${tw`cursor-pointer flex items-center p-4 rounded shadow-lg text-white`}

  svg {
    ${tw`flex-none ml-4 stroke-current w-6`}

    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2px;
  }
`;

const Title = styled.div`
  ${tw`flex-1 text-lg`}
`;

const Inner = styled.div`
  ${tw`p-4`}
`;

interface AccordionProps {
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
          <svg viewBox="0 0 24 24">
            <polyline points={isOpen ? "6 9 12 15 18 9" : "9 6 15 12 9 18"} />
          </svg>
        </Header>
      )}

      {isOpen && <Inner>{props.children}</Inner>}
    </Wrapper>
  );
};

export default Accordion;
