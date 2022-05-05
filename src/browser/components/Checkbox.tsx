import React, { FC, ReactNode } from "react";
import tw, { styled } from "twin.macro";

const Wrapper = styled.button`
  ${tw`cursor-pointer flex items-center text-left disabled:(cursor-default opacity-25)`}
`;

interface ControlProps {
  isChecked?: boolean;
}

const Control = styled.div<ControlProps>`
  ${tw`bg-black/50 flex flex-none h-6 items-center justify-center rounded text-white w-6`}

  svg {
    ${tw`stroke-current w-4`}

    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 3px;
  }

  ${(props) => props.isChecked && tw`bg-purple-500 text-white`}
`;

const Inner = styled.div`
  ${tw`flex-1 ml-3 truncate`}
`;

export interface CheckboxProps {
  onChange?(checked: boolean): void;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  value?: boolean;
}

const Checkbox: FC<CheckboxProps> = (props) => (
  <Wrapper
    disabled={props.disabled}
    className={props.className}
    onClick={() => props.onChange?.(!props.value)}
  >
    <Control isChecked={props.value}>
      {props.value && (
        <svg viewBox="0 0 24 24">
          <path d="M5 12l5 5l10 -10" />
        </svg>
      )}
    </Control>
    {props.children && <Inner>{props.children}</Inner>}
  </Wrapper>
);

export default Checkbox;
