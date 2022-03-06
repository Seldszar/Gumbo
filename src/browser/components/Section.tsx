import React, { FC, ReactNode } from "react";
import tw, { styled } from "twin.macro";

const Header = styled.div`
  ${tw`mb-2 text-lg text-white/50`}
`;

const Wrapper = styled.div`
  ${tw`mb-6 last:mb-0`}
`;

interface Props {
  className?: string;
  title?: ReactNode;
}

const Section: FC<Props> = (props) => (
  <Wrapper className={props.className}>
    {props.title && <Header>{props.title}</Header>}
    {props.children}
  </Wrapper>
);

export default Section;
