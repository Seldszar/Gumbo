import React, { FC, useMemo } from "react";
import tw, { styled } from "twin.macro";

import { SortDirection } from "@/common/types";

import Select, { SelectOption } from "./Select";

const Wrapper = styled.div`
  ${tw`flex gap-2 items-center`}
`;

const IconButton = styled.button`
  ${tw`flex-none text-neutral-600 hover:text-black dark:(text-neutral-400 hover:text-white)`}

  svg {
    ${tw`stroke-current w-5`}

    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2px;
  }
`;

const StyledSelect = styled(Select)`
  ${tw`flex-1`}
`;

export interface SortableSelectProps<T> {
  onDirectionChange(direction: SortDirection): void;
  onValueChange(value: T): void;
  options: Array<SelectOption<T>>;
  direction: SortDirection;
  value: T;
}

const SortableSelect: FC<SortableSelectProps<any>> = (props) => {
  const iconChildren = useMemo(
    () =>
      props.direction === "desc" ? (
        <svg viewBox="0 0 24 24">
          <line x1="4" y1="6" x2="11" y2="6" />
          <line x1="4" y1="12" x2="11" y2="12" />
          <line x1="4" y1="18" x2="13" y2="18" />
          <polyline points="15 9 18 6 21 9" />
          <line x1="18" y1="6" x2="18" y2="18" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24">
          <line x1="4" y1="6" x2="13" y2="6" />
          <line x1="4" y1="12" x2="11" y2="12" />
          <line x1="4" y1="18" x2="11" y2="18" />
          <polyline points="15 15 18 18 21 15" />
          <line x1="18" y1="6" x2="18" y2="18" />
        </svg>
      ),
    [props.direction]
  );

  return (
    <Wrapper>
      <IconButton
        onClick={() => props.onDirectionChange(props.direction === "asc" ? "desc" : "asc")}
      >
        {iconChildren}
      </IconButton>

      <StyledSelect
        value={props.value}
        options={props.options}
        onChange={(value) => props.onValueChange(value)}
      />
    </Wrapper>
  );
};

export default SortableSelect;
