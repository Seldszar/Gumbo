import { IconChevronLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useAsyncFn } from "react-use";
import tw, { styled } from "twin.macro";

import { useHistoryContext } from "../contexts/history";
import { useSearchContext } from "../contexts/search";

import SearchInput from "./SearchInput";
import ReloadIcon from "./ReloadIcon";

const Button = styled.button`
  ${tw`rounded-full flex-none p-2 text-neutral-600 dark:text-neutral-400 [&:not(:disabled)]:hover:(bg-white text-black dark:(bg-black text-white)) disabled:(cursor-default opacity-25)!`}
`;

const Inner = styled.div`
  ${tw`flex-1`}
`;

const Wrapper = styled.div`
  ${tw`bg-gradient-to-b from-neutral-100 from-50% dark:from-neutral-900 to-transparent flex flex-none gap-2 items-center px-2 py-3 sticky top-0 z-20`}
`;

export interface TopBarProps {
  className?: string;
  searchQuery?: string;

  onSearchQueryChange?(value: string): void;
}

function TopBar(props: TopBarProps) {
  const navigate = useNavigate();

  const { locations } = useHistoryContext();
  const { refreshHandlers } = useSearchContext();

  const [state, doRefresh] = useAsyncFn(
    () => Promise.all(Array.from(refreshHandlers, (handler) => handler())),
    [refreshHandlers]
  );

  return (
    <Wrapper className={props.className}>
      <Button disabled={locations.length === 0} onClick={() => navigate(-1)}>
        <IconChevronLeft size="1.25rem" />
      </Button>

      <Inner>
        <SearchInput value={props.searchQuery} onChange={props.onSearchQueryChange} />
      </Inner>

      <Button disabled={refreshHandlers.size === 0} onClick={doRefresh}>
        <ReloadIcon size="1.25rem" isSpinning={state.loading} />
      </Button>
    </Wrapper>
  );
}

export default TopBar;
