import { IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useDebounce } from "react-use";

import { t } from "~/common/helpers";

import { styled } from "~/browser/styled-system/jsx";

const ClearButton = styled("button", {
  base: {
    color: { base: "neutral.600", _dark: "neutral.400" },
    display: "flex",
    flex: "none",

    _hover: {
      color: { base: "black", _dark: "white" },
    },
  },
});

const Wrapper = styled("fieldset", {
  base: {
    bg: { base: "neutral.200", _dark: "neutral.800" },
    cursor: "text",
    display: "flex",
    gap: 3,
    pl: 6,
    pr: 3,
    py: 2,
    rounded: "full",

    _disabled: {
      cursor: "default",
      opacity: 0.5,
    },
  },
});

const Input = styled("input", {
  base: {
    appearance: "none",
    bg: "transparent",
    border: "none",
    color: { base: "black", _dark: "white" },
    flex: 1,
    outline: "none",
  },
});

export interface SearchInputProps {
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;

  value?: string;
  onChange?(value: string): void;
}

function SearchInput(props: SearchInputProps) {
  const [value, setValue] = useState(props.value ?? "");

  useDebounce(() => props.onChange?.(value), 500, [value]);

  return (
    <Wrapper disabled={props.onChange == null} tabIndex={-1} className={props.className}>
      <Input
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
