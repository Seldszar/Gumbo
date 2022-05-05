import React, { FC, ReactNode } from "react";
import tw, { css, styled } from "twin.macro";

const Wrapper = styled.fieldset`
  ${tw`cursor-pointer flex items-center disabled:(cursor-default opacity-25)`}
`;

const Handle = styled.div`
  ${tw`bg-white h-4 rounded-full w-4`}
`;

interface ControlProps {
  isChecked?: boolean;
}

const Control = styled.div<ControlProps>`
  ${tw`bg-black/50 flex justify-start p-1 rounded-full w-12`}

  ${(props) =>
    props.isChecked &&
    css`
      ${tw`bg-purple-500 justify-end`}

      ${Handle} {
        ${tw`bg-white`}
      }
    `}
`;

const Inner = styled.div`
  ${tw`flex-1 mr-4 truncate`}
`;

export interface SwitchProps {
  onChange?(checked: boolean): void;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  value?: boolean;
}

const Switch: FC<SwitchProps> = (props) => (
  <Wrapper
    disabled={props.disabled}
    className={props.className}
    onClick={() => props.onChange?.(!props.value)}
  >
    {props.children && <Inner>{props.children}</Inner>}

    <Control isChecked={props.value}>
      <Handle />
    </Control>
  </Wrapper>
);

export default Switch;
