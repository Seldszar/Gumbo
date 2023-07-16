import { ReactNode } from "react";
import tw, { styled } from "twin.macro";

const Ornament = styled.div`
  ${tw`flex-none self-center`}
`;

const Wrapper = styled.fieldset`
  ${tw`flex gap-3 rounded bg-neutral-300 dark:bg-neutral-700 px-3 disabled:(cursor-default opacity-25)!`}

  input {
    ${tw`appearance-none bg-transparent flex-1 outline-none px-1 py-2 text-black dark:text-white`}
  }
`;

export interface InputProps {
  className?: string;

  value?: string;
  placeholder?: string;

  leftOrnament?: ReactNode;
  rightOrnament?: ReactNode;

  onChange?(value: string): void;
}

function Input(props: InputProps) {
  return (
    <Wrapper className={props.className}>
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
