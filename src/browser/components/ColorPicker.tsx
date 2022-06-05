import React, { FC } from "react";
import tw, { styled } from "twin.macro";

import { PRESET_COLORS } from "@/common/constants";

import Input from "./Input";

const Wrapper = styled.fieldset`
  ${tw`gap-2 grid grid-cols-8`}
`;

interface ButtonProps {
  color: string;
  isSelected?: boolean;
}

const Button = styled.button<ButtonProps>`
  ${tw`rounded shadow-lg disabled:(cursor-default opacity-25)!`}

  background-color: ${(props) => props.color};
  padding-top: 100%;

  ${(props) =>
    props.isSelected &&
    tw`ring-2 ring-inset ring-offset-2 ring-offset-purple-500 ring-white dark:ring-black`}
`;

const ColorInput = styled(Input)`
  ${tw`col-span-4`}
`;

export interface ColorPickerProps {
  onChange?(value: string): void;
  className?: string;
  disabled?: boolean;
  value?: string;
}

const ColorPicker: FC<ColorPickerProps> = (props) => (
  <Wrapper className={props.className} disabled={props.disabled}>
    {PRESET_COLORS.map((color, index) => (
      <Button
        key={index}
        color={color}
        isSelected={color === props.value}
        onClick={() => props.onChange?.(color)}
        title={color}
      />
    ))}

    <ColorInput value={props.value} onChange={props.onChange} />
  </Wrapper>
);

export default ColorPicker;
