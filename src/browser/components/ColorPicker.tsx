import { useEffect, useMemo, useState } from "react";

import { PRESET_COLORS } from "~/common/constants";

import { styled } from "~/browser/styled-system/jsx";

import Input from "./Input";

const Wrapper = styled("fieldset", {
  base: {
    display: "flex",
    flexWrap: "wrap",
    gap: 2,
  },
});

const Button = styled("button", {
  base: {
    h: 10,
    rounded: "sm",
    w: 10,

    _disabled: {
      cursor: "default",
      opacity: 0.25,
    },
  },
  variants: {
    isSelected: {
      true: {
        shadow: {
          base: "inset 0 0 0 2px {colors.purple.500}, inset 0 0 0 4px {colors.white}",
          _dark: "inset 0 0 0 2px {colors.purple.500}, inset 0 0 0 4px {colors.black}",
        },
      },
    },
  },
});

const ColorInput = styled(Input, {
  base: {
    fontFamily: "mono",
    w: 32,
  },
});

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
          isSelected={color === props.value}
          onClick={() => props.onChange(color)}
          style={{ backgroundColor: color }}
          title={color}
        />
      ))}

      <ColorInput error={!isValid} value={computedValue} onChange={setInputValue} />
    </Wrapper>
  );
}

export default ColorPicker;
