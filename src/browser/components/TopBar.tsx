import { IconChevronLeft, IconReload } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useAsyncFn } from "react-use";
import tw, { styled } from "twin.macro";

import { useHistoryContext } from "../contexts/history";
import { useSearchContext } from "../contexts/search";

import SearchInput from "./SearchInput";

interface IconProps {
  isSpinning?: boolean;
}

const Icon = styled(IconReload, {
  shouldForwardProp: (propName) => propName !== "isSpinning",
})<IconProps>`
  ${(props) => props.isSpinning && tw`animate-spin`}
`;

const Button = styled.button`
  ${tw`rounded-full flex-none p-2 text-neutral-600 dark:text-neutral-400 hover:(bg-neutral-200 text-black dark:(bg-black text-white)) disabled:(bg-transparent opacity-25 text-neutral-600 dark:text-neutral-400)!`}
`;

const Input = styled(SearchInput)`
  ${tw`flex-1`}
`;

const Wrapper = styled.div`
  ${tw`bg-neutral-100 dark:bg-neutral-900 flex gap-2 items-center px-2 py-3 shadow-sm dark:shadow-black/25`}
`;

export interface TopBarProps {
  className?: string;
  searchQuery?: string;

  onSearchQueryChange?(value: string): void;
}

function TopBar(props: TopBarProps) {
  const navigate = useNavigate();

  const { index } = useHistoryContext();
  const { refreshHandlers } = useSearchContext();

  const [state, doRefresh] = useAsyncFn(
    () => Promise.all(Array.from(refreshHandlers, (handler) => handler())),
    [refreshHandlers]
  );

  return (
    <Wrapper className={props.className}>
      <Button disabled={index < 1} onClick={() => navigate(-1)}>
        <IconChevronLeft size="1.25rem" />
      </Button>

      <Input value={props.searchQuery} onChange={props.onSearchQueryChange} />

      <Button disabled={refreshHandlers.size === 0} onClick={doRefresh}>
        <Icon size="1.25rem" isSpinning={state.loading} />
      </Button>
    </Wrapper>
  );
}

export default TopBar;
