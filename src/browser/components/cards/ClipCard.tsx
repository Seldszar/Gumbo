import { useMemo } from "react";

import { t, template } from "~/common/helpers";
import { HelixClip } from "~/common/types";

import { formatTime } from "~/browser/helpers";
import { styled } from "~/browser/styled-system/jsx";

import Anchor from "../Anchor";
import Card from "../Card";
import Image from "../Image";
import Tooltip from "../Tooltip";

const Thumbnail = styled("div", {
  base: {
    bg: "black",
    overflow: "hidden",
    pos: "relative",
    rounded: "sm",
    w: 24,
  },
});

const Duration = styled("div", {
  base: {
    bg: "black/75",
    color: "white",
    bottom: 0,
    end: 0,
    fontSize: "sm",
    fontVariantNumeric: "tabular-nums",
    fontWeight: "medium",
    pos: "absolute",
    px: 1,
    roundedStartStart: "md",
  },
});

const Details = styled("ul", {
  base: {
    display: "flex",
    gap: 4,
  },
});

const Wrapper = styled(Card, {
  base: {
    py: 2,
  },
});

export interface ClipCardProps {
  clip: HelixClip;
}

function ClipCard(props: ClipCardProps) {
  const { clip } = props;

  const previewImage = useMemo(
    () => template(clip.thumbnailUrl, { "{height}": 54, "{width}": 96 }),
    [clip.thumbnailUrl],
  );

  const createdAt = useMemo(() => new Date(clip.createdAt), [clip.createdAt]);
  const timeString = useMemo(() => formatTime(clip.duration * 1000), [clip.duration]);

  return (
    <Anchor to={clip.url}>
      <Wrapper
        title={
          <Tooltip content={clip.title}>
            <span>{clip.title || <i>{t("detailText_noTitle")}</i>}</span>
          </Tooltip>
        }
        subtitle={clip.broadcasterName}
        leftOrnament={
          <Thumbnail>
            <Image src={previewImage} ratio={9 / 16} />
            <Duration>{timeString}</Duration>
          </Thumbnail>
        }
      >
        <Details>
          <li>{createdAt.toLocaleString()}</li>
          <li>{t("detailText_viewCount", clip.viewCount.toLocaleString())}</li>
        </Details>
      </Wrapper>
    </Anchor>
  );
}

export default ClipCard;
