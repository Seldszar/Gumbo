import { IconChevronLeft, IconReload } from "@tabler/icons-react";
import { useNavigate } from "react-router";
import { useAsyncFn } from "react-use";

import { styled } from "~/browser/styled-system/jsx";

import { useHistoryContext } from "../contexts/history";
import { useSearchContext } from "../contexts/search";

import SearchInput from "./SearchInput";

const Icon = styled(IconReload, {
  base: {},
  variants: {
    isSpinning: {
      true: {
        animation: "spin",
      },
    },
  },
  defaultVariants: {
    isSpinning: false,
  },
});

const Button = styled("button", {
  base: {
    color: { base: "neutral.600", _dark: "neutral.400" },
    flex: "none",
    p: 2,
    rounded: "full",

    _hover: {
      bg: { base: "neutral.200", _dark: "black" },
      color: { base: "black", _dark: "white" },
    },

    _disabled: {
      bg: "transparent",
      color: { base: "neutral.600", _dark: "neutral.400" },
      opacity: 0.25,
    },
  },
});

const Input = styled(SearchInput, {
  base: {
    flex: 1,
  },
});

const Wrapper = styled("div", {
  base: {
    alignItems: "center",
    bg: { base: "neutral.100", _dark: "neutral.900" },
    display: "flex",
    gap: 2,
    px: 2,
    py: 3,
    shadow: "md",
    shadowColor: { base: "black/10", _dark: "black/20" },
  },
});

export interface TopBarProps {
  className?: string;
  searchQuery?: string;

  onSearchQueryChange?(value: string): void;
}

function TopBar(props: TopBarProps) {
  const navigate = useNavigate();

  const { isDefaultLocation } = useHistoryContext();
  const { refreshHandlers } = useSearchContext();

  const [state, doRefresh] = useAsyncFn(
    () => Promise.all(Array.from(refreshHandlers, (handler) => handler())),
    [refreshHandlers],
  );

  return (
    <Wrapper className={props.className}>
      <Button disabled={isDefaultLocation} onClick={() => navigate(-1)}>
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
