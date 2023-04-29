import { IconX } from "@tabler/icons-react";
import { ReactNode, MouseEventHandler } from "react";
import tw, { styled } from "twin.macro";

const Wrapper = styled.div`
  ${tw`bg-neutral-100 dark:bg-neutral-900 px-6 relative rounded shadow-lg`}
`;

const Header = styled.div`
  ${tw`bg-gradient-to-b from-neutral-100 from-50% dark:from-neutral-900 to-transparent flex items-start py-6 sticky top-0 z-10`}
`;

const Title = styled.div`
  ${tw`flex-1 font-bold text-purple-500 text-xl`}
`;

const CloseButton = styled.button`
  ${tw`flex-none ltr:-mr-1 rtl:-ml-1 -mt-1 p-1 text-black dark:text-white opacity-50 hover:opacity-100`}
`;

const Inner = styled.div`
  ${tw`pb-6`}
`;

export interface PanelProps {
  onClose?: MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
  className?: string;
  title?: ReactNode;
}

function Panel(props: PanelProps) {
  return (
    <Wrapper className={props.className}>
      <Header>
        <Title>{props.title}</Title>
        {props.onClose && (
          <CloseButton onClick={props.onClose}>
            <IconX size="1.5rem" />
          </CloseButton>
        )}
      </Header>
      <Inner>{props.children}</Inner>
    </Wrapper>
  );
}

export default Panel;
