import React, { FC } from "react";
import tw, { styled } from "twin.macro";

const Wrapper = styled.input`
  ${tw`flex gap-1 py-2 rounded shadow-lg bg-neutral-300 dark:bg-neutral-700 ltr:(pl-4 pr-3) rtl:(pl-3 pr-4) w-full disabled:(cursor-default opacity-25)!`}
`;

export interface InputProps {
  onChange?(value: string): void;
  placeholder?: string;
  className?: string;
  value?: string;
}

const Input: FC<InputProps> = (props) => (
  <Wrapper
    value={props.value}
    className={props.className}
    placeholder={props.placeholder}
    onChange={(event) => props.onChange?.(event.target.value)}
  />
);

export default Input;
