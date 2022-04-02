import React, { FC, useMemo } from "react";
import tw, { styled } from "twin.macro";

import Image from "../Image";
import Tooltip from "../Tooltip";

const StyledImage = styled(Image)``;

const Wrapper = styled.div`
  ${tw`bg-black cursor-pointer overflow-hidden relative rounded shadow text-sm`}

  padding-top: 133.333%;

  ${StyledImage} {
    ${tw`absolute h-full inset-0 object-cover w-full`}
  }
`;

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
    <Tooltip content={category.name}>
      {(ref) => (
        <Wrapper ref={ref}>
          <StyledImage src={boxArtUrl} />
        </Wrapper>
      )}
    </Tooltip>
  );
};

export default CategoryCard;
