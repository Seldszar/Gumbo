import { PropsOf } from "@emotion/react";
import React, { FC } from "react";
import tw, { styled } from "twin.macro";

import Anchor from "./Anchor";

const Icon = styled.svg`
  ${tw`ml-1 opacity-50 stroke-current w-4`}

  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5px;
`;

const Wrapper = styled(Anchor)`
  ${tw`inline-flex items-center hover:underline`}
`;

const ExternalAnchor: FC<PropsOf<typeof Wrapper>> = (props) => (
  <Wrapper {...props} target="_blank" rel="noreferrer">
    {props.children}
    <Icon viewBox="0 0 24 24">
      <path d="M11 7h-5a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-5" />
      <line x1="10" y1="14" x2="20" y2="4" />
      <polyline points="15 4 20 4 20 9" />
    </Icon>
  </Wrapper>
);

export default ExternalAnchor;
