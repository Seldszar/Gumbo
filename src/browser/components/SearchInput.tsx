import { FC, useRef, useState } from "react";
import { useDebounce, useMount } from "react-use";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

const ActionBadge = styled.div`
  ${tw`absolute bg-purple-500 content h-2 pointer-events-none ring-2 ring-neutral-200 dark:ring-neutral-800 right-0 rounded-full top-0 w-2`}
`;

const ActionButton = styled.button`
  ${tw`flex flex-none text-neutral-600 dark:text-neutral-400 hover:(text-black dark:text-white)`}

  svg {
    ${tw`stroke-current w-5`}

    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2px;
  }
`;

const ActionList = styled.ul`
  ${tw`flex flex-none gap-4 items-center self-center`}

  li {
    ${tw`relative`}
  }
`;

const SearchIcon = styled.svg`
  ${tw`block flex-none pointer-events-none stroke-current text-neutral-600 dark:text-neutral-400 w-5`}

  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2px;
`;

const Wrapper = styled.label`
  ${tw`bg-neutral-200 dark:bg-neutral-800 cursor-text flex gap-3 px-4 rounded-full shadow-md`}

  input {
    ${tw`appearance-none bg-transparent flex-1 outline-none py-2 text-black dark:text-white`}
  }

  &:focus,
  &:focus-within {
    ${tw`bg-white dark:bg-black ring-2 ring-inset ring-purple-500`}

    ${ActionBadge} {
      ${tw`ring-white dark:ring-black`}
    }
  }
`;

export interface SearchInputProps {
  onChange?(value: string): void;
  actionButtons?: any[];
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  value?: string;
}

const SearchInput: FC<SearchInputProps> = (props) => {
  const ref = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState(props.value ?? "");

  useDebounce(() => props.onChange?.(value), 500, [value]);
  useMount(() => props.autoFocus && ref.current?.focus());

  return (
    <Wrapper tabIndex={-1} className={props.className}>
      <SearchIcon viewBox="0 0 24 24">
        <circle cx="10" cy="10" r="7" />
        <line x1="21" y1="21" x2="15" y2="15" />
      </SearchIcon>

      <input
        ref={ref}
        value={value}
        placeholder={props.placeholder ?? t("optionValue_search")}
        onChange={(event) => setValue(event.target.value)}
      />

      {props.actionButtons && (
        <ActionList>
          {props.actionButtons.map(({ withBadge, ...rest }, index) => (
            <li key={index}>
              <ActionButton {...rest} />
              {withBadge && <ActionBadge />}
            </li>
          ))}
        </ActionList>
      )}
    </Wrapper>
  );
};

export default SearchInput;
