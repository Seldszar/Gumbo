import { map, xor } from "es-toolkit/compat";
import { ReactNode } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import Checkbox from "./Checkbox";

const PresetButton = styled.button`
  ${tw`font-medium text-sm text-neutral-600 dark:text-neutral-400 uppercase hover:(text-black dark:text-white) disabled:(cursor-default opacity-25 text-neutral-600 dark:text-neutral-400)!`}
`;

const PresetList = styled.div`
  ${tw`flex flex-wrap gap-x-6 mb-3`}
`;

const Grid = styled.div`
  ${tw`gap-3 grid grid-cols-2`}
`;

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
