import React, { ReactNode, FC, MouseEventHandler } from "react";
import tw, { styled } from "twin.macro";

const Wrapper = styled.div`
  ${tw`bg-neutral-100 dark:bg-neutral-900 px-6 relative rounded shadow-lg`}
`;

const Header = styled.div`
  ${tw`bg-gradient-to-b from-neutral-100 via-neutral-100 dark:(from-neutral-900 via-neutral-900) to-transparent flex items-start py-6 sticky top-0 z-10`}
`;

const Title = styled.div`
  ${tw`flex-1 font-bold text-purple-500 text-xl`}
`;

const CloseButton = styled.button`
  ${tw`flex-none -mr-1 -mt-1 p-1 text-black dark:text-white opacity-50 hover:opacity-100`}

  svg {
    ${tw`stroke-current w-6`}

    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2px;
  }
`;

const Inner = styled.div`
  ${tw`pb-6`}
`;

export interface PanelProps {
  onClose?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  title?: ReactNode;
}

const Panel: FC<PanelProps> = (props) => (
  <Wrapper className={props.className}>
    <Header>
      <Title>{props.title}</Title>
      {props.onClose && (
        <CloseButton onClick={props.onClose}>
          <svg viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </CloseButton>
      )}
    </Header>
    <Inner>{props.children}</Inner>
  </Wrapper>
);

export default Panel;
