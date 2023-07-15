import { IconDots } from "@tabler/icons-react";
import { HTMLAttributes, forwardRef } from "react";
import tw, { styled } from "twin.macro";

const Button = styled.button`
  ${tw`bg-white border border-neutral-300 px-2 rounded transition shadow-lg hover:(bg-neutral-200 shadow-black/25) dark:(bg-neutral-800 border-neutral-700 hover:bg-neutral-700)`}
`;

export type DropdownButtonProps = HTMLAttributes<HTMLButtonElement>;

const DropdownButton = forwardRef<HTMLButtonElement, DropdownButtonProps>((props, ref) => (
  <Button {...props} ref={ref}>
    <IconDots size="1rem" />
  </Button>
));

export default DropdownButton;
