import { filter } from "lodash-es";
import { FC, useMemo } from "react";
import tw, { styled } from "twin.macro";

import { SortDirection } from "~/common/types";

import Select, { SelectProps } from "./Select";
import SortButton from "./SortButton";

const Wrapper = styled.div`
  ${tw`flex gap-4 items-center`}
`;

const Spacer = styled.div`
  ${tw`flex-1`}
`;

export interface FilterProps extends SelectProps {
  side: "left" | "right";
}

export interface FilterBarProps {
  onDirectionChange?(value: SortDirection): void;
  className?: string;
  direction?: SortDirection;
  filters: FilterProps[];
}

const FilterBar: FC<FilterBarProps> = (props) => {
  const leftFilters = useMemo(() => filter(props.filters, { side: "left" }), [props.filters]);
  const rightFilters = useMemo(() => filter(props.filters, { side: "right" }), [props.filters]);

  return (
    <Wrapper className={props.className}>
      {leftFilters.map((props, index) => (
        <Select {...props} key={index} />
      ))}

      <Spacer />

      {rightFilters.map((props, index) => (
        <Select {...props} key={index} />
      ))}

      {props.onDirectionChange && (
        <SortButton value={props.direction} onChange={props.onDirectionChange} />
      )}
    </Wrapper>
  );
};

export default FilterBar;
