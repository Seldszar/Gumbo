import { useEffect, useMemo, useState } from "react";
import tw, { styled } from "twin.macro";

import { PRESET_COLORS } from "~/common/constants";

import Input from "./Input";

const Wrapper = styled.fieldset`
  ${tw`flex flex-wrap gap-2`}
`;

interface ButtonProps {
  color: string;
  isSelected?: boolean;
}

const Button = styled.button<ButtonProps>`
  ${tw`h-10 rounded w-10 disabled:(cursor-default opacity-25)!`}

  background-color: ${(props) => props.color};

  ${(props) =>
    props.isSelected &&
    tw`ring-2 ring-inset ring-offset-2 ring-offset-purple-500 ring-white dark:ring-black`}
`;

const ColorInput = styled(Input)`
  ${tw`font-mono w-32`}
`;

export interface ColorPickerProps {
  className?: string;
  disabled?: boolean;

  value: string;
  onChange(value: string): void;
}

function ColorPicker(props: ColorPickerProps) {
  const [inputValue, setInputValue] = useState("");

  const computedValue = useMemo(() => inputValue || props.value, [inputValue, props.value]);
  const isValid = useMemo(() => CSS.supports("color", computedValue), [computedValue]);

  useEffect(() => setInputValue(""), [props.value]);
  useEffect(() => {
    if (isValid && inputValue.length > 0) {
      props.onChange(inputValue);
    }
  }, [isValid, inputValue]);

  return (
    <Wrapper className={props.className} disabled={props.disabled}>
      {PRESET_COLORS.map((color, index) => (
        <Button
          key={index}
          color={color}
          isSelected={color === props.value}
          onClick={() => props.onChange(color)}
          title={color}
        />
      ))}

      <ColorInput error={!isValid} value={computedValue} onChange={setInputValue} />
    </Wrapper>
  );
}

export default ColorPicker;
