import { keyframes, PropsOf } from "@emotion/react";

import { css, styled } from "twin.macro";

const spinAnimation = keyframes`
  100% {
    transform: rotate(-360deg);
  }
`;

interface WrapperProps {
  isSpinning?: boolean;
}

const Wrapper = styled.svg<WrapperProps>`
  ${(props) =>
    props.isSpinning &&
    css`
      animation: ${spinAnimation} 1s infinite;
    `}
`;

function RefreshIcon(props: PropsOf<typeof Wrapper>) {
  return (
    <Wrapper {...props} viewBox="0 0 24 24">
      <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
    </Wrapper>
  );
}

export default RefreshIcon;
