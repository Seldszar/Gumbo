import { useMemo } from "react";
import { NavLink } from "react-router";

import { t, template } from "~/common/helpers";
import { HelixGame } from "~/common/types";

import { styled } from "~/browser/styled-system/jsx";

import ExternalAnchor from "./ExternalAnchor";
import Image from "./Image";

const Wrapper = styled("div", {
  base: {
    pos: "relative",
  },
});

const Inner = styled("div", {
  base: {
    display: "flex",
    flexDir: "column",
    p: 6,
    placeItems: "center",
    pos: "relative",
    zIndex: 10,
  },
});

const Background = styled("div", {
  base: {
    inset: 0,
    overflow: "hidden",
    pos: "absolute",

    _after: {
      bgGradient: "to-b",
      content: "",
      gradientFrom: "transparent",
      gradientTo: { base: "white", _dark: "neutral.900" },
      inset: 0,
      pos: "absolute",
    },
  },
});

const BackgroundImage = styled(Image, {
  base: {
    blur: "sm",
    h: "full",
    objectFit: "cover",
    opacity: 0.5,
    w: "full",
  },
});

const Thumbnail = styled("div", {
  base: {
    bg: "black",
    mb: 2,
    overflow: "hidden",
    rounded: "sm",
    shadow: "md",
  },
});

const ThumbnailImage = styled(Image, {
  base: {
    objectFit: "cover",
    objectPosition: "top",
    w: "66px",
  },
});

const Name = styled("div", {
  base: {
    fontSize: "2xl",
    fontWeight: "bold",
    textAlign: "center",
  },
});

const TabList = styled("div", {
  base: {
    display: "flex",
  },
});

const Tab = styled(NavLink, {
  base: {
    borderBottomWidth: 1,
    borderColor: { base: "neutral.200", _dark: "neutral.800" },
    color: { base: "neutral.600", _dark: "neutral.400" },
    flex: 1,
    pos: "relative",
    py: 3,
    textAlign: "center",

    "&.active": {
      borderColor: "purple.500",
      color: { base: "black", _dark: "white" },
      fontWeight: "medium",
    },
  },
});

export interface CategoryTitleProps {
  className?: string;
  category: HelixGame;
}

function CategoryTitle(props: CategoryTitleProps) {
  const { category } = props;

  const boxArtUrl = useMemo(
    () => template(category.boxArtUrl, { "{width}": 66, "{height}": 88 }),
    [category.boxArtUrl],
  );

  return (
    <Wrapper className={props.className}>
      <Background>
        <BackgroundImage src={boxArtUrl} />
      </Background>

      <Inner>
        <Thumbnail>
          <ThumbnailImage src={boxArtUrl} ratio={4 / 3} />
        </Thumbnail>

        <Name>{category.name}</Name>

        {category.igdbId && (
          <ExternalAnchor to={`https://igdb.com/g/${parseInt(category.igdbId).toString(36)}`}>
            {t("buttonText_viewOn", "IGDB")}
          </ExternalAnchor>
        )}
      </Inner>

      <TabList>
        <Tab to="streams">{t("titleText_streams")}</Tab>
        <Tab to="videos">{t("titleText_videos")}</Tab>
        <Tab to="clips">{t("titleText_clips")}</Tab>
      </TabList>
    </Wrapper>
  );
}

export default CategoryTitle;
