import { ReactNode } from "react";
import tw, { styled } from "twin.macro";

const Header = styled.div`
  ${tw`font-medium mb-2 text-neutral-600 dark:text-neutral-400 text-sm uppercase`}
`;

const Wrapper = styled.div`
  ${tw`mb-6 last:mb-0`}

  p {
    ${tw`mb-2 last:mb-0`}
  }
`;

interface Props {
  children?: ReactNode;
  className?: string;
  title?: ReactNode;
}

function Section(props: Props) {
  return (
    <Wrapper className={props.className}>
      {props.title && <Header>{props.title}</Header>}
      {props.children}
    </Wrapper>
  );
}

export default Section;
