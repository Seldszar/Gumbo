import { IconChevronDown, IconPointFilled } from "@tabler/icons-react";
import { useMemo } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import DropdownMenu from "~/browser/components/DropdownMenu";

interface WrapperProps {
  fullWidth?: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  ${tw`cursor-pointer flex gap-1 items-center disabled:(cursor-default opacity-25)!`}

  ${(props) =>
    props.fullWidth
      ? tw`py-2 rounded bg-neutral-300 hover:bg-neutral-400 dark:(bg-neutral-700 hover:bg-neutral-600) ps-4 pe-3`
      : tw`text-sm text-neutral-600 hover:text-black dark:(text-neutral-400 hover:text-white)`}
`;

const Inner = styled.div`
  ${tw`flex-1`}
`;

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
