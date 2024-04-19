import { IconChevronDown, IconPointFilled } from "@tabler/icons-react";
import { useMemo } from "react";

import { t } from "~/common/helpers";

import { styled } from "~/browser/styled-system/jsx";

import DropdownMenu from "./DropdownMenu";

const Wrapper = styled("div", {
  base: {
    alignItems: "center",
    cursor: { base: "pointer", _disabled: "default" },
    display: "flex",
    gap: 1,
    opacity: { _disabled: 0.25 },
  },
  variants: {
    fullWidth: {
      false: {
        color: { base: "neutral.600", _dark: "neutral.400" },
        fontSize: "sm",

        _hover: {
          color: { base: "black", _dark: "white" },
        },
      },
      true: {
        bg: { base: "neutral.300", _dark: "neutral.700" },
        pe: 4,
        ps: 3,
        py: 2,
        rounded: "sm",

        _hover: {
          color: { base: "neutral.400", _dark: "neutral.600" },
        },
      },
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
});

const Inner = styled("div", {
  base: {
    flex: 1,
  },
});

export interface SelectOption<T> {
  label: string;
  value: T;
}

export interface SelectProps<T> {
  fullWidth?: boolean;
  className?: string;

  options: Array<SelectOption<T>>;
  value: T;

  onChange(value: any): void;
}

function Select<T>(props: SelectProps<T>) {
  const { options, value } = props;

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  return (
    <DropdownMenu
      placement="bottom-end"
      fullWidth={props.fullWidth}
      items={options.map((option) => {
        let icon;

        if (option.value === value) {
          icon = <IconPointFilled size="1.25rem" />;
        }

        return {
          onClick: () => props.onChange(option.value),
          title: option.label,
          type: "normal",
          icon,
        };
      })}
    >
      <Wrapper fullWidth={props.fullWidth} className={props.className}>
        <Inner>{selectedOption?.label ?? t("optionValue_unknown")}</Inner>
        <IconChevronDown size="1.25rem" />
      </Wrapper>
    </DropdownMenu>
  );
}

export default Select;
