import React, { FC } from "react";
import tw, { styled } from "twin.macro";

import { SortDirection } from "~/common/types";

const Wrapper = styled.button`
  ${tw`text-neutral-600 hover:text-black dark:(text-neutral-400 hover:text-white)`}

  svg {
    ${tw`stroke-current w-5`}

    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2px;
  }
`;

export interface SortButtonProps {
  onChange?(value: SortDirection): void;
  className?: string;
  value?: SortDirection;
}

const SortButton: FC<SortButtonProps> = (props) => {
  const handleClick = () => props.onChange?.(props.value === "asc" ? "desc" : "asc");

  return (
    <Wrapper className={props.className} onClick={handleClick}>
      <svg viewBox="0 0 24 24">
        {props.value === "desc" ? (
          <>
            <line x1="4" y1="6" x2="11" y2="6" />
            <line x1="4" y1="12" x2="11" y2="12" />
            <line x1="4" y1="18" x2="13" y2="18" />
            <polyline points="15 9 18 6 21 9" />
            <line x1="18" y1="6" x2="18" y2="18" />
          </>
        ) : (
          <>
            <line x1="4" y1="6" x2="13" y2="6" />
            <line x1="4" y1="12" x2="11" y2="12" />
            <line x1="4" y1="18" x2="11" y2="18" />
            <polyline points="15 15 18 18 21 15" />
            <line x1="18" y1="6" x2="18" y2="18" />
          </>
        )}
      </svg>
    </Wrapper>
  );
};

export default SortButton;
