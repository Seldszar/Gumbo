import React, { FC, useMemo } from "react";
import { NavLink } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { t, template } from "~/common/helpers";

import Image from "./Image";

const Wrapper = styled.div`
  ${tw`flex gap-4 px-4 relative`}
`;

const Background = styled.div`
  ${tw`absolute bg-white dark:bg-black inset-0 -mt-20 overflow-hidden`}

  &::after {
    ${tw`absolute inset-0 bg-gradient-to-b content from-transparent to-white dark:to-black z-10`}
  }
`;

const BackgroundImage = styled(Image)`
  ${tw`h-full inset-0 object-cover w-full`}

  filter: blur(4px) opacity(0.5);
  mix-blend-mode: screen;
`;

const Aside = styled.div`
  ${tw`flex-none py-4 relative self-end w-16 z-10`}
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
  ${tw`flex-auto px-4 py-2 rounded-t text-center hover:(text-black dark:text-white)`}

  &.active {
    ${tw`(bg-neutral-100 dark:bg-neutral-900 text-purple-500)!`}
  }
`;

export interface CategoryTitleProps {
  className?: string;
  category: any;
}

const CategoryTitle: FC<CategoryTitleProps> = (props) => {
  const { category } = props;

  const boxArtUrl = useMemo(
    () => template(category.box_art_url, { "{width}": 78, "{height}": 104 }),
    [category.box_art_url]
  );

  return (
    <Wrapper className={props.className}>
      <Background>
        <BackgroundImage src={boxArtUrl} />
      </Background>

      <Aside>
        <Thumbnail>
          <ThumbnailImage src={boxArtUrl} ratio={4 / 3} />
        </Thumbnail>
      </Aside>

      <Inner>
        <Title>
          <Name>{category.name}</Name>
        </Title>
        <TabList>
          <Tab to="streams">{t("titleText_streams")}</Tab>
          <Tab to="videos">{t("titleText_videos")}</Tab>
          <Tab to="clips">{t("titleText_clips")}</Tab>
        </TabList>
      </Inner>
    </Wrapper>
  );
};

export default CategoryTitle;
