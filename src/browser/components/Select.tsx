import { find } from "lodash-es";
import React, { FC, ReactNode, useMemo } from "react";
import tw, { styled } from "twin.macro";

import ContextMenu from "@/browser/components/ContextMenu";

const Wrapper = styled.div`
  ${tw`cursor-pointer flex text-neutral-400 text-sm hover:text-white`}
`;

const Inner = styled.div`
  ${tw`flex-1`}
`;

const Icon = styled.svg`
  ${tw`flex-none ml-1 stroke-current w-5`}

  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2px;
`;

export interface SelectOption<T> {
  label: ReactNode;
  value: T;
}

export interface SelectProps<T> {
  onChange(value: T): void;
  className?: string;
  options: SelectOption<T>[];
  value: T;
}

const Select: FC<SelectProps<any>> = (props) => {
  const { options, value } = props;

  const selectedOption = useMemo(() => find(options, { value }), [options, value]);

  return (
    <ContextMenu
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
        <Wrapper className={props.className} ref={ref}>
          <Inner>{selectedOption?.label ?? "Unknown"}</Inner>
          <Icon viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9" />
          </Icon>
        </Wrapper>
      )}
    </ContextMenu>
  );
};

export default Select;
