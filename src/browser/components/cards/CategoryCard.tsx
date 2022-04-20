import React, { FC, useMemo } from "react";
import tw, { styled } from "twin.macro";

import Image from "../Image";
import Tooltip from "../Tooltip";

const StyledImage = styled(Image)``;

const Picture = styled.div`
  ${tw`bg-black cursor-pointer mb-1 overflow-hidden relative rounded shadow text-sm`}

  padding-top: 133.333%;

  ${StyledImage} {
    ${tw`absolute h-full inset-0 object-cover w-full`}
  }
`;

const Name = styled.div`
  ${tw`font-medium text-white truncate`}
`;

const Wrapper = styled.div``;

export interface CategoryCardProps {
  category: any;
}

const CategoryCard: FC<CategoryCardProps> = (props) => {
  const { category } = props;

  const boxArtUrl = useMemo(
    () => category.box_art_url.replace("{width}", 78).replace("{height}", 104),
    [category.box_art_url]
  );

  return (
    <Wrapper>
      <Picture>
        <StyledImage src={boxArtUrl} />
      </Picture>
      <Tooltip content={category.name}>{(ref) => <Name ref={ref}>{category.name}</Name>}</Tooltip>
    </Wrapper>
  );
};

export default CategoryCard;
