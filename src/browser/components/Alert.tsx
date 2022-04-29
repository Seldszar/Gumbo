import React, { FC, MouseEventHandler, ReactNode } from "react";
import tw, { styled } from "twin.macro";

const Wrapper = styled.div`
  ${tw`bg-neutral-800 cursor-pointer flex gap-6 items-center px-6 py-4 shadow-lg transition hover:bg-neutral-700`}

  svg {
    ${tw`flex-none stroke-current w-8`}

    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.5px;
  }
`;

const Inner = styled.div`
  ${tw`flex-1`}
`;

interface AlertProps {
  onClick?: MouseEventHandler<HTMLDivElement>;
  children?: ReactNode;
  className?: string;
  icon?: ReactNode;
}

const Alert: FC<AlertProps> = (props) => (
  <Wrapper className={props.className} onClick={props.onClick}>
    {props.icon}

    <Inner>{props.children}</Inner>
  </Wrapper>
);

export default Alert;
