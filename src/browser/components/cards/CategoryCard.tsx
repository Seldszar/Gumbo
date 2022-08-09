import React, { FC, MouseEventHandler, useMemo } from "react";
import tw, { css, styled } from "twin.macro";

import { template } from "@/common/helpers";

import Image from "../Image";
import Tooltip from "../Tooltip";

const OffGroup = styled.g`
  ${tw`invisible`}
`;

const OnGroup = styled.g`
  ${tw`invisible`}
`;

interface TogglePinProps {
  isPinned?: boolean;
}

const TogglePin = styled.button<TogglePinProps>`
  ${tw`absolute bg-neutral-700 hidden p-1 rounded right-1 top-1 shadow transition hover:(bg-neutral-600 visible) active:bg-neutral-800`}

  svg {
    ${tw`flex-none stroke-current w-5`}

    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2px;
  }

  ${(props) =>
    props.isPinned
      ? css`
          ${tw`bg-purple-500 hover:bg-purple-400 active:bg-purple-600 block`}

          ${OffGroup} {
            ${tw`visible`}
          }

          :hover {
            ${OffGroup} {
              ${tw`invisible`}
            }

            ${OnGroup} {
              ${tw`visible`}
            }
          }
        `
      : css`
          ${OffGroup} {
            ${tw`visible`}
          }
        `}
`;

const Cover = styled.div`
  ${tw`bg-black mb-1 overflow-hidden relative rounded shadow`}

  :hover ${TogglePin} {
    ${tw`block`}
  }
`;

const Name = styled.div`
  ${tw`font-medium text-black dark:text-white truncate`}
`;

const Wrapper = styled.div``;

export interface CategoryCardProps {
  onTogglePinClick?(): void;
  isPinned?: boolean;
  category: any;
}

const CategoryCard: FC<CategoryCardProps> = (props) => {
  const { category } = props;

  const boxArtUrl = useMemo(
    () => template(category.box_art_url, { "{width}": 78, "{height}": 104 }),
    [category.box_art_url]
  );

  const onTogglePinClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();

    props.onTogglePinClick?.();
  };

  return (
    <Wrapper>
      <Cover>
        <Image src={boxArtUrl} ratio={4 / 3} />

        {props.onTogglePinClick && (
          <TogglePin isPinned={props.isPinned} onClick={onTogglePinClick}>
            <svg viewBox="0 0 24 24">
              <OnGroup>
                <line x1="3" y1="3" x2="21" y2="21" />
                <path d="M15 4.5l-3.249 3.249m-2.57 1.433l-2.181 .818l-1.5 1.5l7 7l1.5 -1.5l.82 -2.186m1.43 -2.563l3.25 -3.251" />
                <line x1="9" y1="15" x2="4.5" y2="19.5" />
                <line x1="14.5" y1="4" x2="20" y2="9.5" />
              </OnGroup>
              <OffGroup>
                <path d="M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4" />
                <line x1="9" y1="15" x2="4.5" y2="19.5" />
                <line x1="14.5" y1="4" x2="20" y2="9.5" />
              </OffGroup>
            </svg>
          </TogglePin>
        )}
      </Cover>
      <Tooltip content={category.name}>{(ref) => <Name ref={ref}>{category.name}</Name>}</Tooltip>
    </Wrapper>
  );
};

export default CategoryCard;
