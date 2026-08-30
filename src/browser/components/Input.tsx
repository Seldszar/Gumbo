import { HTMLProps, ReactNode } from "react";
import tw, { styled } from "twin.macro";

const Ornament = styled.div`
  ${tw`flex-none self-center`}
`;

interface WrapperProps {
  error?: boolean;
}

const Wrapper = styled.label<WrapperProps>`
  ${tw`flex gap-3 rounded bg-neutral-300 dark:bg-neutral-700 px-3 disabled:(cursor-default opacity-25)!`}

  input {
    ${tw`appearance-none bg-transparent flex-1 outline-none px-1 py-2 text-current`}
  }

  ${(props) => props.error && tw`outline outline-2 outline-red-500 text-red-500!`}
`;

export interface InputProps extends Omit<HTMLProps<HTMLInputElement>, "onChange"> {
  error?: boolean;

  leftOrnament?: ReactNode;
  rightOrnament?: ReactNode;

  onChange?(value: string): void;
}

function Input(props: InputProps) {
  const { error, className, leftOrnament, rightOrnament, onChange, ...rest } = props;

  return (
    <Wrapper error={error} className={className}>
      {leftOrnament && <Ornament>{leftOrnament}</Ornament>}

      <input {...rest} onChange={(event) => onChange?.(event.target.value)} />

      {rightOrnament && <Ornament>{rightOrnament}</Ornament>}
    </Wrapper>
  );
}

export default Input;
