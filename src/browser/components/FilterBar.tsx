import { filter } from "es-toolkit/compat";
import { useMemo } from "react";

import { SortDirection } from "~/common/types";

import { styled } from "~/browser/styled-system/jsx";

import Select, { SelectProps } from "./Select";
import SortButton from "./SortButton";

const Wrapper = styled("div", {
  base: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: { base: "neutral.200", _dark: "neutral.800" },
    display: "flex",
    gap: 4,
    p: 4,
  },
});

const Spacer = styled("div", {
  base: {
    flex: 1,
  },
});

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
