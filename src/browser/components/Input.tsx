import { ReactNode } from "react";

import { styled } from "~/browser/styled-system/jsx";

const Ornament = styled("div", {
  base: {
    alignSelf: "center",
    flex: "none",
  },
});

const Wrapper = styled("fieldset", {
  base: {
    bg: { base: "neutral.300", _dark: "neutral.700" },
    display: "flex",
    gap: 3,
    px: 3,
    rounded: "sm",

    _disabled: {
      cursor: "default",
      opacity: 0.25,
    },

    "& input": {
      appearance: "none",
      bg: "transparent",
      border: "none",
      color: { base: "black", _dark: "white" },
      flex: 1,
      outline: "none",
      px: 1,
      py: 2,
      w: "full",
    },
  },
  variants: {
    error: {
      true: {
        color: "red.500",
        outlineColor: "red.500",
        outlineWidth: 2,
      },
    },
  },
});

export interface InputProps {
  className?: string;

  value?: string;
  placeholder?: string;
  error?: boolean;

  leftOrnament?: ReactNode;
  rightOrnament?: ReactNode;

  onChange?(value: string): void;
}

function Input(props: InputProps) {
  return (
    <Wrapper error={props.error} className={props.className}>
      {props.leftOrnament && <Ornament>{props.leftOrnament}</Ornament>}

      <input
        value={props.value}
        placeholder={props.placeholder}
        onChange={(event) => props.onChange?.(event.target.value)}
      />

      {props.rightOrnament && <Ornament>{props.rightOrnament}</Ornament>}
    </Wrapper>
  );
}

export default Input;
