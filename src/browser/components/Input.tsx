import { ReactNode } from "react";
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
