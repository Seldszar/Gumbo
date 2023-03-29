import { keyframes, PropsOf } from "@emotion/react";
import { FC } from "react";
import { css, styled } from "twin.macro";

const rotateAnimation = keyframes`
  100% {
    transform: rotate(-360deg);
  }
`;

interface WrapperProps {
  isRefreshing?: boolean;
}

const Wrapper = styled.svg<WrapperProps>`
  ${(props) =>
    props.isRefreshing &&
    css`
      animation: ${rotateAnimation} 1s infinite;
    `}
`;

const RefreshIcon: FC<PropsOf<typeof Wrapper>> = (props) => (
  <Wrapper {...props} viewBox="0 0 24 24">
    <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
    <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
  </Wrapper>
);

export default RefreshIcon;
