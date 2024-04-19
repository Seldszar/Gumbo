import { IconCheck } from "@tabler/icons-react";
import { ReactNode } from "react";

import { styled } from "~/browser/styled-system/jsx";

const Wrapper = styled("button", {
  base: {
    alignItems: "center",
    cursor: { base: "pointer", _disabled: "default" },
    display: "flex",
    gap: 3,
    opacity: { _disabled: 0.25 },
    textAlign: "left",
  },
});

const Control = styled("div", {
  base: {
    alignItems: "center",
    bg: { base: "neutral.300", _dark: "neutral.700" },
    display: "flex",
    flex: "none",
    h: 6,
    justifyContent: "center",
    rounded: "sm",
    w: 6,
  },
  variants: {
    isChecked: {
      true: {
        bg: "purple.500",
        color: "white",
      },
    },
  },
  defaultVariants: {
    isChecked: false,
  },
});

const Inner = styled("div", {
  base: {
    flex: 1,
    truncate: true,
  },
});

export interface CheckboxProps {
  onChange?(checked: boolean): void;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  value?: boolean;
}

function Checkbox(props: CheckboxProps) {
  return (
    <Wrapper
      disabled={props.disabled}
      className={props.className}
      onClick={() => props.onChange?.(!props.value)}
    >
      <Control isChecked={props.value}>
        {props.value && <IconCheck size="1rem" strokeWidth={3} />}
      </Control>
      {props.children && <Inner>{props.children}</Inner>}
    </Wrapper>
  );
}

export default Checkbox;
