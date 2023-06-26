import { useMemo } from "react";
import tw, { styled } from "twin.macro";

import { template } from "~/common/helpers";
import { HelixCategorySearchResult, HelixGame } from "~/common/types";

import DropdownButton from "../DropdownButton";
import Image from "../Image";
import Tooltip from "../Tooltip";

import CategoryDropdown from "../dropdowns/CategoryDropdown";

const StyledDropdownButton = styled(DropdownButton)`
  ${tw`absolute invisible end-2 -top-2 z-20`}
`;

const CoverImage = styled(Image)`
  ${tw`bg-black rounded`}
`;

const Cover = styled.div`
  ${tw`mb-1 relative`}

  :hover ${StyledDropdownButton} {
    ${tw`visible`}
  }
`;

const Name = styled.div`
  ${tw`font-medium text-black dark:text-white truncate`}
`;

export interface CategoryCardProps {
  category: HelixGame | HelixCategorySearchResult;

  onNewCollection?(): void;
}

function CategoryCard(props: CategoryCardProps) {
  const { category } = props;

  const boxArtUrl = useMemo(
    () => template(category.boxArtUrl, { "{width}": 78, "{height}": 104 }),
    [category.boxArtUrl]
  );

  return (
    <div>
      <Cover>
        <CoverImage src={boxArtUrl} ratio={4 / 3} />

        <CategoryDropdown category={category} onNewCollection={props.onNewCollection}>
          <StyledDropdownButton />
        </CategoryDropdown>
      </Cover>
      <Name>
        <Tooltip content={category.name}>
          <span>{category.name}</span>
        </Tooltip>
      </Name>
    </div>
  );
}

export default CategoryCard;
