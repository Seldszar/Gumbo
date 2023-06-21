import tw, { styled } from "twin.macro";

const Wrapper = styled.input`
  ${tw`flex gap-1 py-2 rounded bg-neutral-300 dark:bg-neutral-700 ps-4 pe-3 w-full disabled:(cursor-default opacity-25)!`}
`;

export interface InputProps {
  onChange?(value: string): void;
  placeholder?: string;
  className?: string;
  value?: string;
}

function Input(props: InputProps) {
  return (
    <Wrapper
      value={props.value}
      className={props.className}
      placeholder={props.placeholder}
      onChange={(event) => props.onChange?.(event.target.value)}
    />
  );
}

export default Input;
