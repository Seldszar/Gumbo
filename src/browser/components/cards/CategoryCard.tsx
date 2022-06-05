import React, { FC, useMemo } from "react";
import tw, { styled } from "twin.macro";

import { template } from "@/common/helpers";

import Image from "../Image";
import Tooltip from "../Tooltip";

const Picture = styled.div`
  ${tw`bg-black mb-1 overflow-hidden relative rounded shadow`}
`;

const Name = styled.div`
  ${tw`font-medium text-black dark:text-white truncate`}
`;

const Wrapper = styled.div``;

export interface CategoryCardProps {
  category: any;
}

const CategoryCard: FC<CategoryCardProps> = (props) => {
  const { category } = props;

  const boxArtUrl = useMemo(
    () => template(category.box_art_url, { "{width}": 78, "{height}": 104 }),
    [category.box_art_url]
  );

  return (
    <Wrapper>
      <Picture>
        <Image src={boxArtUrl} ratio={4 / 3} />
      </Picture>
      <Tooltip content={category.name}>{(ref) => <Name ref={ref}>{category.name}</Name>}</Tooltip>
    </Wrapper>
  );
};

export default CategoryCard;
