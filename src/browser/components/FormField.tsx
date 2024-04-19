import { ReactNode } from "react";

import { styled } from "~/browser/styled-system/jsx";

const Wrapper = styled("fieldset", {
  base: {
    display: "grid",
    gap: 1,
    mb: { base: 4, _last: 0 },

    _disabled: {
      opacity: 0.25,
    },
  },
});

const Header = styled("div", {
  base: {
    color: { base: "black", _dark: "white" },
  },
});

const Footer = styled("div", {
  base: {
    color: { base: "neutral.600", _dark: "neutral.400" },
    fontSize: "sm",
  },
});

interface FormFieldProps {
  children?: ReactNode;
  className?: string;
  helpText?: ReactNode;
  disabled?: boolean;
  title?: ReactNode;
}

function FormField(props: FormFieldProps) {
  return (
    <Wrapper className={props.className} disabled={props.disabled}>
      {props.title && <Header>{props.title}</Header>}

      <div>{props.children}</div>

      {props.helpText && <Footer>{props.helpText}</Footer>}
    </Wrapper>
  );
}

export default FormField;
