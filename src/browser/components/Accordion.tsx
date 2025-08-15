import { IconChevronRight } from "@tabler/icons-react";
import { ReactNode } from "react";
import tw, { styled } from "twin.macro";

interface WrapperProps {
  open?: boolean;
}

const Icon = styled(IconChevronRight)`
  ${tw`transition`}
`;

const Title = styled.div`
  ${tw`flex-1 font-medium text-sm truncate uppercase`}
`;

const HeaderInner = styled.div`
  ${tw`cursor-pointer flex flex-1 gap-1 items-center`}
`;

const HeaderAside = styled.div`
  ${tw`flex-none invisible`}
`;

const Header = styled.div`
  ${tw`flex gap-1 items-center px-4 py-2 text-neutral-600 dark:text-neutral-400`}

  :hover {
    ${HeaderAside} {
      ${tw`visible`}
    }

    ${HeaderInner} {
      ${tw`text-black dark:text-white`}
    }
  }
`;

const Inner = styled.div``;

const Wrapper = styled.div<WrapperProps>`
  ${Icon} {
    ${(props) => props.open && tw`rotate-90`}
  }
`;

export interface AccordionProps {
  className?: string;

  children?: ReactNode;
  aside?: ReactNode;

  title: ReactNode;

  open?: boolean;
  onOpenChange?(open: boolean): void;
}

function Accordion(props: AccordionProps) {
  return (
    <Wrapper className={props.className} open={props.open}>
      <Header>
        <HeaderInner onClick={() => props.onOpenChange?.(!props.open)}>
          <Icon size="1rem" />
          <Title>{props.title}</Title>
        </HeaderInner>

        {props.aside && <HeaderAside>{props.aside}</HeaderAside>}
      </Header>

      {props.open && <Inner>{props.children}</Inner>}
    </Wrapper>
  );
}

export default Accordion;
