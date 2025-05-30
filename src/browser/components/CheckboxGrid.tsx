import { map, xor } from "es-toolkit/compat";
import { ReactNode } from "react";

import { t } from "~/common/helpers";

import { styled } from "~/browser/styled-system/jsx";

import Checkbox from "./Checkbox";

const PresetButton = styled("button", {
  base: {
    color: { base: "neutral.600", _dark: "neutral.400" },
    fontSize: "sm",
    fontWeight: "medium",
    textTransform: "uppercase",

    _hover: {
      color: { base: "black", _dark: "white" },
    },

    _disabled: {
      color: { base: "neutral.600", _dark: "neutral.400" },
      cursor: "default",
      opacity: 0.25,
    },
  },
});

const PresetList = styled("div", {
  base: {
    columnGap: 6,
    display: "flex",
    flexWrap: "wrap",
    mb: 3,
  },
});

const Grid = styled("div", {
  base: {
    display: "grid",
    gap: 3,
    gridTemplateColumns: 2,
  },
});

export interface OptionProps<T> {
  title: ReactNode;
  value: T;
}

export interface CheckboxGridProps<T> {
  className?: string;
  disabled?: boolean;

  options: OptionProps<T>[];

  value: T[];
  onChange(value: T[]): void;
}

function CheckboxGrid<T extends number | string>(props: CheckboxGridProps<T>) {
  const register = (value: T) => ({
    onChange: () => props.onChange(xor(props.value, [value])),
    value: props.value.includes(value) ?? false,
  });

  return (
    <fieldset className={props.className} disabled={props.disabled}>
      <PresetList>
        <PresetButton onClick={() => props.onChange?.([])}>
          {t("buttonText_selectNone")}
        </PresetButton>
        <PresetButton onClick={() => props.onChange?.(map(props.options, "value"))}>
          {t("buttonText_selectAll")}
        </PresetButton>
      </PresetList>
      <Grid>
        {props.options.map((option) => (
          <Checkbox key={option.value} {...register(option.value)}>
            {option.title}
          </Checkbox>
        ))}
      </Grid>
    </fieldset>
  );
}

export default CheckboxGrid;
