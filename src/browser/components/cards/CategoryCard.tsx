import { useMemo } from "react";

import { template } from "~/common/helpers";
import { HelixCategorySearchResult, HelixGame } from "~/common/types";

import { styled } from "~/browser/styled-system/jsx";

import DropdownButton from "../DropdownButton";
import Image from "../Image";
import Tooltip from "../Tooltip";

import CategoryDropdown from "../dropdowns/CategoryDropdown";

const StyledDropdownButton = styled(DropdownButton, {
  base: {
    end: 2,
    pos: "absolute",
    top: -2,
    visibility: { base: "hidden", _groupHover: "visible" },
    zIndex: 20,
  },
});

const CoverImage = styled(Image, {
  base: {
    bg: "black",
    rounded: "sm",
  },
});

const Cover = styled("div", {
  base: {
    mb: 1,
    pos: "relative",
  },
});

const Name = styled("div", {
  base: {
    color: { base: "black", _dark: "white" },
    fontWeight: "medium",
    truncate: true,
  },
});

export interface CategoryCardProps {
  category: HelixGame | HelixCategorySearchResult;

  onNewCollection?(): void;
}

function CategoryCard(props: CategoryCardProps) {
  const { category } = props;

  const boxArtUrl = useMemo(
    () => template(category.boxArtUrl, { "{width}": 78, "{height}": 104 }),
    [category.boxArtUrl],
  );

  return (
    <div>
      <Cover className="group">
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
