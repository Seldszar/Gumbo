import React, { FC, ReactNode } from "react";
import tw, { styled } from "twin.macro";

const Wrapper = styled.fieldset`
  ${tw`grid gap-2 mb-3 last:mb-0 disabled:opacity-25`}
`;

const Header = styled.div`
  ${tw`text-black dark:text-white`}
`;

const Inner = styled.div``;

const Footer = styled.div`
  ${tw`text-sm text-white/50 dark:text-white/50`}
`;

interface FormFieldProps {
  className?: string;
  helpText?: ReactNode;
  disabled?: boolean;
  title?: ReactNode;
}

const FormField: FC<FormFieldProps> = (props) => (
  <Wrapper className={props.className} disabled={props.disabled}>
    {props.title && <Header>{props.title}</Header>}

    <Inner>{props.children}</Inner>

    {props.helpText && <Footer>{props.helpText}</Footer>}
  </Wrapper>
);

export default FormField;
