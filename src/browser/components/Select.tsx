import { find } from "lodash-es";
import { FC, ReactNode, useMemo } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import ContextMenu from "~/browser/components/ContextMenu";

interface WrapperProps {
  fullWidth?: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  ${tw`cursor-pointer flex gap-1 disabled:(cursor-default opacity-25)!`}

  ${(props) =>
    props.fullWidth
      ? tw`py-2 rounded shadow-lg bg-neutral-300 hover:bg-neutral-400 dark:(bg-neutral-700 hover:bg-neutral-600) ltr:(pl-4 pr-3) rtl:(pl-3 pr-4)`
      : tw`text-sm text-neutral-600 hover:text-black dark:(text-neutral-400 hover:text-white)`}
`;

const Inner = styled.div`
  ${tw`flex-1`}
`;

const Icon = styled.svg`
  ${tw`flex-none stroke-current w-5`}

  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2px;
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
            icon = (
              <svg viewBox="0 0 24 24">
                <path d="M5 12l5 5l10 -10" />
              </svg>
            );
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
          <Icon viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9" />
          </Icon>
        </Wrapper>
      )}
    </ContextMenu>
  );
};

export default Select;
