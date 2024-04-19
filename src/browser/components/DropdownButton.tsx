import { IconDots } from "@tabler/icons-react";
import { HTMLAttributes, forwardRef } from "react";

import { styled } from "~/browser/styled-system/jsx";

const Button = styled("button", {
  base: {
    bg: { base: "white", _dark: "neutral.800" },
    borderColor: { base: "neutral.300", _dark: "neutral.700" },
    borderWidth: 1,
    px: 2,
    rounded: "sm",
    shadow: "lg",
    transition: "colors",

    _hover: {
      bg: { base: "neutral.200", _dark: "neutral.700" },
      shadowColor: "black/25",
    },
  },
});

export type DropdownButtonProps = HTMLAttributes<HTMLButtonElement>;

const DropdownButton = forwardRef<HTMLButtonElement, DropdownButtonProps>((props, ref) => (
  <Button {...props} ref={ref}>
    <IconDots size="1rem" />
  </Button>
));

export default DropdownButton;
