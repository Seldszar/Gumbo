import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";

import { styled } from "~/browser/styled-system/jsx";

import Spinner from "./Spinner";

const Icon = styled("div", {
  base: {
    alignSelf: "center",
    flex: "none",
  },
});

const Inner = styled("div", {
  base: {},
  variants: {
    isLoading: {
      true: {
        visibility: "hidden",
      },
    },
  },

  defaultVariants: {
    isLoading: false,
  },
});

const Loading = styled("div", {
  base: {
    display: "grid",
    inset: 0,
    placeContent: "center",
    pos: "absolute",
  },
});

const StyledSpinner = styled(Spinner, {
  base: {
    color: "white",
    w: 6,
  },
});

const Wrapper = styled("button", {
  base: {
    display: "flex",
    gap: 2,
    placeContent: "center",
    pos: "relative",
    px: 4,
    py: 2,
    rounded: "sm",
    transition: "colors",

    _disabled: {
      cursor: "default",
      opacity: 0.25,
    },
  },
  variants: {
    color: {
      purple: {
        bg: { base: "purple.500", _hover: "purple.400", _active: "purple.600" },
        color: "white",
      },

      red: {
        bg: { base: "red.500", _hover: "red.400", _active: "red.600" },
        color: "white",
      },

      neutral: {
        bg: { base: "neutral.300", _dark: "neutral.700" },

        _hover: {
          bg: { base: "neutral.400", _dark: "neutral.600" },
        },

        _active: {
          bg: { base: "neutral.200", _dark: "neutral.800" },
        },
      },

      transparent: {
        _hover: {
          bg: { base: "black/10", _dark: "white/10" },
        },

        _active: {
          bg: "black/25",
        },
      },
    },

    fullWidth: {
      true: {
        w: "full",
      },
    },
  },

  defaultVariants: {
    color: "neutral",
    fullWidth: false,
  },
});

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "purple" | "transparent" | "red" | "neutral";
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { children, icon, ...rest } = props;

  return (
    <Wrapper {...rest} ref={ref} disabled={rest.disabled || rest.loading}>
      {icon && <Icon>{icon}</Icon>}

      <Inner>{children}</Inner>

      {rest.loading && (
        <Loading>
          <StyledSpinner />
        </Loading>
      )}
    </Wrapper>
  );
});

export default Button;
