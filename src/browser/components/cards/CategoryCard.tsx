import { IconPin, IconPinnedOff } from "@tabler/icons-react";
import { MouseEventHandler, useMemo } from "react";
import tw, { styled } from "twin.macro";

import { template } from "~/common/helpers";
import { HelixCategorySearchResult, HelixGame } from "~/common/types";

import Image from "../Image";
import Tooltip from "../Tooltip";

const TogglePin = styled.button`
  ${tw`absolute bg-neutral-700 hidden p-1 rounded right-1 top-1 shadow transition hover:(bg-neutral-600 visible) active:bg-neutral-800`}
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

export interface CategoryCardProps {
  onTogglePinClick?(): void;
  isPinned?: boolean;
  category: HelixGame | HelixCategorySearchResult;
}

function CategoryCard(props: CategoryCardProps) {
  const { category } = props;

  const boxArtUrl = useMemo(
    () => template(category.boxArtUrl, { "{width}": 78, "{height}": 104 }),
    [category.boxArtUrl]
  );

  const onTogglePinClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();

    props.onTogglePinClick?.();
  };

  return (
    <div>
      <Cover>
        <Image src={boxArtUrl} ratio={4 / 3} />

        {props.onTogglePinClick && (
          <TogglePin onClick={onTogglePinClick}>
            {props.isPinned ? <IconPinnedOff size="1.25rem" /> : <IconPin size="1.25rem" />}
          </TogglePin>
        )}
      </Cover>
      <Tooltip content={category.name}>
        {(getReferenceProps) => <Name {...getReferenceProps()}>{category.name}</Name>}
      </Tooltip>
    </div>
  );
}

export default CategoryCard;
