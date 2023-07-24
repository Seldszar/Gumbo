import { ReactNode } from "react";
import tw, { styled } from "twin.macro";

const Wrapper = styled.fieldset`
  ${tw`grid gap-1 mb-4 last:mb-0 disabled:opacity-25`}
`;

const Header = styled.div`
  ${tw`text-black dark:text-white`}
`;

const Footer = styled.div`
  ${tw`text-sm text-neutral-600 dark:text-neutral-400`}
`;

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
