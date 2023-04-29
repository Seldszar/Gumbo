import { IconChevronLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { useHistoryContext } from "../contexts/history";

import SearchInput from "./SearchInput";

const OrnamentButton = styled.button`
  ${tw`rounded-full flex-none p-2 text-neutral-600 dark:text-neutral-400 [&:not(:disabled)]:hover:(bg-white text-black dark:(bg-black text-white)) disabled:(cursor-default opacity-25)!`}
`;

const Ornament = styled.div`
  ${tw`border-neutral-300 dark:border-neutral-700 flex flex-none gap-4 items-center`}
`;

const Inner = styled.div`
  ${tw`flex-1`}
`;

const Wrapper = styled.div`
  ${tw`bg-gradient-to-b from-neutral-100 from-50% dark:from-neutral-900 to-transparent flex flex-none gap-2 items-center px-2 py-3 sticky top-0 z-20`}
`;

export interface TopBarProps {
  onChange?(value: string): void;

  leftOrnament?: any[];
  rightOrnament?: any[];

  className?: string;
}

function TopBar(props: TopBarProps) {
  const { leftOrnament, rightOrnament } = props;

  const stack = useHistoryContext();
  const navigate = useNavigate();

  return (
    <Wrapper className={props.className}>
      <Ornament>
        <OrnamentButton disabled={stack.length === 0} onClick={() => navigate(-1)}>
          <IconChevronLeft size="1.25rem" />
        </OrnamentButton>

        {leftOrnament?.map((props, index) => (
          <OrnamentButton key={index} {...props} />
        ))}
      </Ornament>

      <Inner>
        <SearchInput onChange={props.onChange} />
      </Inner>

      <Ornament>
        {rightOrnament?.map((props, index) => (
          <OrnamentButton key={index} {...props} />
        ))}
      </Ornament>
    </Wrapper>
  );
}

export default TopBar;
