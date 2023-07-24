import { IconSortDescending, IconSortAscending } from "@tabler/icons-react";
import tw, { styled } from "twin.macro";

import { SortDirection } from "~/common/types";

const Wrapper = styled.button`
  ${tw`text-neutral-600 hover:text-black dark:(text-neutral-400 hover:text-white)`}
`;

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
