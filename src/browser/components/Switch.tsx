import { ReactNode } from "react";

import { styled } from "~/browser/styled-system/jsx";

const Wrapper = styled("fieldset", {
  base: {
    alignItems: "center",
    cursor: "pointer",
    display: "flex",
    gap: 4,

    _disabled: {
      cursor: "default",
      opacity: 0.25,
    },
  },
});

const Handle = styled("div", {
  base: {
    bg: "white",
    borderRadius: "full",
    height: 4,
    width: 4,
  },
});

const Control = styled("div", {
  base: {
    bg: { base: "neutral.700", _dark: "neutral.300" },
    display: "flex",
    justifyContent: "start",
    padding: 1,
    rounded: "full",
    width: 12,
  },

  variants: {
    isChecked: {
      true: {
        bg: "purple.500",
        justifyContent: "center",
      },
    },
  },
});

const Inner = styled("div", {
  base: {
    flex: 1,
    lineHeight: "tight",
  },
});

export interface SwitchProps {
  children?: ReactNode;
  className?: string;

  disabled?: boolean;
  value?: boolean;

  onChange?(checked: boolean): void;
}

function Switch(props: SwitchProps) {
  return (
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
}

export default Switch;
