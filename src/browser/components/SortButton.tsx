import { IconSortDescending, IconSortAscending } from "@tabler/icons-react";

import { SortDirection } from "~/common/types";

import { styled } from "~/browser/styled-system/jsx";

const Wrapper = styled("button", {
  base: {
    color: { base: "neutral.600", _dark: "neutral.400" },

    _hover: {
      color: { base: "black", _dark: "white" },
    },
  },
});

export interface SortButtonProps {
  className?: string;

  value?: SortDirection;
  onChange?(value: SortDirection): void;
}

function SortButton(props: SortButtonProps) {
  const isDescending = props.value === "desc";

  const handleClick = () => {
    props.onChange?.(isDescending ? "asc" : "desc");
  };

  return (
    <Wrapper className={props.className} onClick={handleClick}>
      {isDescending ? <IconSortDescending size="1.25rem" /> : <IconSortAscending size="1.25rem" />}
    </Wrapper>
  );
}

export default SortButton;
