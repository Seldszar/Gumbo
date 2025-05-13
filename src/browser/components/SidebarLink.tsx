import { NavLink } from "react-router";

import { styled, HTMLStyledProps } from "~/browser/styled-system/jsx";

import Tooltip from "./Tooltip";

const Wrapper = styled(NavLink, {
  base: {
    color: { base: "neutral.600", _dark: "neutral.400" },
    display: "grid",
    p: 2,
    placeContent: "center",

    _hover: {
      color: { base: "black", _dark: "white" },
    },

    "&.active": {
      color: "purple.500",
    },
  },
});

function SidebarLink(props: HTMLStyledProps<typeof Wrapper>) {
  const { title, ...rest } = props;

  return (
    <Tooltip placement="right" title={title}>
      <Wrapper {...rest}>{props.children}</Wrapper>
    </Tooltip>
  );
}

export default SidebarLink;
