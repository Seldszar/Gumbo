import { IconCheck } from "@tabler/icons-react";
import { ReactNode } from "react";
import tw, { styled } from "twin.macro";

const Wrapper = styled.button`
  ${tw`cursor-pointer flex gap-3 items-center text-left disabled:(cursor-default opacity-25)`}
`;

interface ControlProps {
  isChecked?: boolean;
}

const Control = styled.div<ControlProps>`
  ${tw`bg-black/50 flex flex-none h-6 items-center justify-center rounded text-white w-6`}

  ${(props) => props.isChecked && tw`bg-purple-500 text-white`}
`;

const Inner = styled.div`
  ${tw`flex-1 truncate`}
`;

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
