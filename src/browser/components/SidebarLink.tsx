import { PropsOf } from "@emotion/react";
import { NavLink } from "react-router";
import tw, { styled } from "twin.macro";

import Tooltip from "./Tooltip";

const Wrapper = styled(NavLink)`
  ${tw`grid p-2 place-content-center text-neutral-600 hover:text-black dark:(text-neutral-400 hover:text-white) [&.active]:text-purple-500!`}
`;

function SidebarLink(props: PropsOf<typeof Wrapper>) {
  const { title, ...rest } = props;

  return (
    <Tooltip placement="right" content={title}>
      <Wrapper {...rest}>{props.children}</Wrapper>
    </Tooltip>
  );
}

export default SidebarLink;
