import { keyframes } from "@emotion/react";
import React, { FC, HTMLAttributes } from "react";
import tw, { styled } from "twin.macro";

const rotateAnimation = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const dashAnimation = keyframes`
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }

  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
`;

const Wrapper = styled.svg`
  ${tw`text-purple-500`}

  animation: ${rotateAnimation} 2s linear infinite;

  circle {
    stroke: currentColor;
    stroke-linecap: round;
    animation: ${dashAnimation} 1.5s ease-in-out infinite;
  }
`;

const Spinner: FC<HTMLAttributes<SVGElement>> = (props) => (
  <Wrapper {...props} viewBox="0 0 50 50">
    <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
  </Wrapper>
);

export default Spinner;
