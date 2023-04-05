import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import { find } from "lodash-es";
import { FC, ReactNode, useMemo } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import ContextMenu from "~/browser/components/ContextMenu";

interface WrapperProps {
  fullWidth?: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  ${tw`cursor-pointer flex gap-1 items-center disabled:(cursor-default opacity-25)!`}

  ${(props) =>
    props.fullWidth
      ? tw`py-2 rounded shadow-lg bg-neutral-300 hover:bg-neutral-400 dark:(bg-neutral-700 hover:bg-neutral-600) ltr:(pl-4 pr-3) rtl:(pl-3 pr-4)`
      : tw`text-sm text-neutral-600 hover:text-black dark:(text-neutral-400 hover:text-white)`}
`;

const Inner = styled.div`
  ${tw`flex-1`}
`;

export interface SelectOption {
  label: ReactNode;
  value: any;
}

export interface SelectProps {
  onChange(value: any): void;
  className?: string;
  options: SelectOption[];
  fullWidth?: boolean;
  value: any;
}

const Select: FC<SelectProps> = (props) => {
  const { options, value } = props;

  const selectedOption = useMemo(() => find(options, { value }), [options, value]);

  return (
    <ContextMenu
      fullWidth={props.fullWidth}
      placement="bottom-end"
      menu={{
        items: options.map((option) => {
          let icon;

          if (option.value === value) {
            icon = <IconCheck size="1.25rem" />;
          }

          return {
            onClick: () => props.onChange?.(option.value),
            children: option.label,
            type: "link",
            icon,
          };
        }),
      }}
    >
      {(ref) => (
        <Wrapper fullWidth={props.fullWidth} className={props.className} ref={ref}>
          <Inner>{selectedOption?.label ?? t("optionValue_unknown")}</Inner>
          <IconChevronDown size="1.25rem" />
        </Wrapper>
      )}
    </ContextMenu>
  );
};

export default Select;
