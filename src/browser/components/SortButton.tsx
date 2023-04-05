import { IconSortDescending, IconSortAscending } from "@tabler/icons-react";

import tw, { styled } from "twin.macro";

import { SortDirection } from "~/common/types";

const Wrapper = styled.button`
  ${tw`text-neutral-600 hover:text-black dark:(text-neutral-400 hover:text-white)`}
`;

export interface SortButtonProps {
  onChange?(value: SortDirection): void;
  className?: string;
  value?: SortDirection;
}

function SortButton(props: SortButtonProps) {
  const handleClick = () => props.onChange?.(props.value === "asc" ? "desc" : "asc");

  return (
    <Wrapper className={props.className} onClick={handleClick}>
      {props.value === "desc" ? (
        <IconSortDescending size="1.25rem" />
      ) : (
        <IconSortAscending size="1.25rem" />
      )}
    </Wrapper>
  );
}

export default SortButton;
