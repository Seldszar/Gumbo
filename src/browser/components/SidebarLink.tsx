import { PropsOf } from "@emotion/react";
import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import tw, { styled } from "twin.macro";

import Tooltip from "./Tooltip";

const Wrapper = styled(NavLink)`
  ${tw`grid p-2 place-content-center text-neutral-600 hover:text-black dark:(text-neutral-400 hover:text-white)`}

  svg {
    ${tw`stroke-current w-6`}

    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2px;
  }

  &.active {
    ${tw`text-purple-500!`}
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
