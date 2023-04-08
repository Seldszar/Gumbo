import { IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useDebounce } from "react-use";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

const ActionButton = styled.button`
  ${tw`flex flex-none text-neutral-600 dark:text-neutral-400 hover:(text-black dark:text-white)`}
`;

interface OrnamentProps {
  side: "left" | "right";
}

const Ornament = styled.div<OrnamentProps>`
  ${tw`border-neutral-300 dark:border-neutral-700 flex flex-none gap-4 items-center`}

  ${(props) => {
    switch (props.side) {
      case "left":
        return tw`border-r pl-2 pr-3`;

      case "right":
        return tw`border-l ml-2 pl-3 pr-2`;
    }
  }}
`;

const Inner = styled.div`
  ${tw`flex flex-1 gap-3 items-center pl-4 pr-2`}
`;

const Wrapper = styled.label`
  ${tw`bg-neutral-200 dark:bg-neutral-800 cursor-text flex p-2 rounded-full shadow-md`}

  input {
    ${tw`appearance-none bg-transparent flex-1 outline-none text-black dark:text-white`}
  }
`;

export interface SearchInputProps {
  onChange?(value: string): void;
  leftOrnament?: any[];
  rightOrnament?: any[];
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  value?: string;
}

function SearchInput(props: SearchInputProps) {
  const [value, setValue] = useState(props.value ?? "");

  useDebounce(() => props.onChange?.(value), 500, [value]);

  return (
    <Wrapper tabIndex={-1} className={props.className}>
      {props.leftOrnament && (
        <Ornament side="left">
          {props.leftOrnament.map((props, index) => (
            <ActionButton key={index} {...props} />
          ))}
        </Ornament>
      )}

      <Inner>
        <input
          value={value}
          placeholder={props.placeholder ?? t("optionValue_search")}
          onChange={(event) => setValue(event.target.value)}
          autoFocus={props.autoFocus}
        />

        {value && (
          <ActionButton onClick={() => setValue("")}>
            <IconX size="1.25rem" />
          </ActionButton>
        )}
      </Inner>

      {props.rightOrnament && (
        <Ornament side="right">
          {props.rightOrnament.map((props, index) => (
            <ActionButton key={index} {...props} />
          ))}
        </Ornament>
      )}
    </Wrapper>
  );
}

export default SearchInput;
