import React, { FC, useMemo } from "react";
import { NavLink } from "react-router-dom";
import tw, { styled } from "twin.macro";

import Image from "./Image";

const Wrapper = styled.div`
  ${tw`flex px-4 relative`}
`;

const Background = styled.div`
  ${tw`absolute bg-black inset-0 -mt-20 overflow-hidden`}

  &::after {
    ${tw`absolute inset-0 bg-gradient-to-b content from-transparent to-black z-10`}
  }
`;

const BackgroundImage = styled(Image)`
  ${tw`h-full inset-0 object-cover w-full`}

  filter: blur(4px) opacity(0.5);
  mix-blend-mode: screen;
`;

const Aside = styled.div`
  ${tw`flex-none mr-4 py-4 relative self-end w-16 z-10`}
`;

const Thumbnail = styled.div`
  ${tw`bg-black overflow-hidden relative rounded shadow z-10`}

  padding-top: 133.333%;
`;

const ThumbnailImage = styled(Image)`
  ${tw`absolute h-full inset-0 object-cover object-top w-full`}
`;

const Inner = styled.div`
  ${tw`flex flex-col flex-1 relative z-10`}
`;

const Title = styled.div`
  ${tw`flex flex-1 font-bold items-center py-4`}
`;

const Name = styled.div`
  ${tw`font-bold text-2xl leading-none`}
`;

const TabList = styled.div`
  ${tw`flex flex-none`}
`;

const Tab = styled(NavLink)`
  ${tw`flex-auto px-4 py-2 rounded-t text-center hover:text-white`}

  &.active {
    ${tw`(bg-neutral-900 text-purple-500)!`}
  }
`;

export interface CategoryTitleProps {
  className?: string;
  category: any;
}

const CategoryTitle: FC<CategoryTitleProps> = (props) => {
  const { category } = props;

  const boxArtUrl = useMemo(
    () => category.box_art_url.replace("{width}", 78).replace("{height}", 104),
    [category.box_art_url]
  );

  return (
    <Wrapper className={props.className}>
      <Background>
        <BackgroundImage src={boxArtUrl} />
      </Background>

      <Aside>
        <Thumbnail>
          <ThumbnailImage src={boxArtUrl} />
        </Thumbnail>
      </Aside>
      <Inner>
        <Title>
          <Name>{category.name}</Name>
        </Title>
        <TabList>
          <Tab to="streams">Streams</Tab>
          <Tab to="videos">Videos</Tab>
          <Tab to="clips">Clips</Tab>
        </TabList>
      </Inner>
    </Wrapper>
  );
};

export default CategoryTitle;
