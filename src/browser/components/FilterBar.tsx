import { filter } from "es-toolkit/compat";
import { useMemo } from "react";
import tw, { styled } from "twin.macro";

import { SortDirection } from "~/common/types";

import Select, { SelectProps } from "./Select";
import SortButton from "./SortButton";

const Wrapper = styled.div`
  ${tw`border-b border-neutral-200 dark:border-neutral-800 flex gap-4 items-center p-4`}
`;

const Spacer = styled.div`
  ${tw`flex-1`}
`;

export interface FilterProps extends SelectProps<any> {
  side: "left" | "right";
}

export interface FilterBarProps {
  className?: string;

  filters: FilterProps[];

  direction?: SortDirection;
  onDirectionChange?(value: SortDirection): void;
}

function FilterBar(props: FilterBarProps) {
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
}

export default FilterBar;
