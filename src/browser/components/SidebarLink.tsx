import { PropsOf } from "@emotion/react";
import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import tw, { styled } from "twin.macro";

import Tooltip from "./Tooltip";

const Wrapper = styled(NavLink)`
  ${tw`grid p-2 place-content-center text-white opacity-50 hover:opacity-100`}

  svg {
    ${tw`stroke-current w-6`}

    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2px;
  }

  &.active {
    ${tw`(opacity-100 text-purple-500)!`}
  }
`;

const SidebarLink: FC<PropsOf<typeof Wrapper>> = (props) => {
  const { title, ...rest } = props;

  return (
    <Tooltip content={title}>
      {(ref) => (
        <Wrapper {...rest} ref={ref}>
          {props.children}
        </Wrapper>
      )}
    </Tooltip>
  );
};

export default SidebarLink;
