import { IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useDebounce } from "react-use";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

const ClearButton = styled.button`
  ${tw`flex flex-none text-neutral-600 dark:text-neutral-400 hover:(text-black dark:text-white)`}
`;

const Wrapper = styled.fieldset`
  ${tw`bg-neutral-200 dark:bg-neutral-800 cursor-text flex gap-3 px-4 py-2 rounded-full disabled:(cursor-default opacity-50)`}

  input {
    ${tw`appearance-none bg-transparent flex-1 outline-none text-black dark:text-white`}
  }
`;

export interface SearchInputProps {
  onChange?(value: string): void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  value?: string;
}

function SearchInput(props: SearchInputProps) {
  const [value, setValue] = useState(props.value ?? "");

  useDebounce(() => props.onChange?.(value), 500, [value]);

  return (
    <Wrapper disabled={props.onChange == null} tabIndex={-1} className={props.className}>
      <input
        value={value}
        placeholder={props.placeholder ?? t("optionValue_search")}
        onChange={(event) => setValue(event.target.value)}
        autoFocus={props.autoFocus}
      />

      {value && (
        <ClearButton onClick={() => setValue("")}>
          <IconX size="1.25rem" />
        </ClearButton>
      )}
    </Wrapper>
  );
}

export default SearchInput;
