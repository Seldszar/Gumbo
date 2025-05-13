import { useMemo } from "react";

import { t, template } from "~/common/helpers";
import { HelixVideo } from "~/common/types";

import { parseFormatDuration } from "~/browser/helpers";
import { styled } from "~/browser/styled-system/jsx";

import Anchor from "../Anchor";
import Card from "../Card";
import ChannelName from "../ChannelName";
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

export interface VideoCardProps {
  video: HelixVideo;
}

function VideoCard(props: VideoCardProps) {
  const { video } = props;

  const previewImage = useMemo(
    () => template(video.thumbnailUrl, { "%{width}": 96, "%{height}": 54 }),
    [video.thumbnailUrl],
  );

  const createdAt = useMemo(() => new Date(video.createdAt), [video.createdAt]);
  const durationString = useMemo(() => parseFormatDuration(video.duration), [video.duration]);

  return (
    <Anchor to={video.url}>
      <Wrapper
        title={
          <Tooltip title={video.title}>
            <span>{video.title || <i>{t("detailText_noTitle")}</i>}</span>
          </Tooltip>
        }
        subtitle={<ChannelName login={video.userLogin} name={video.userName} />}
        leftOrnament={
          <Thumbnail>
            <Image src={previewImage} ratio={9 / 16} />
            <Duration>{durationString}</Duration>
          </Thumbnail>
        }
      >
        <Details>
          <li>{createdAt.toLocaleString()}</li>
          <li>{t("detailText_viewCount", video.viewCount.toLocaleString())}</li>
        </Details>
      </Wrapper>
    </Anchor>
  );
}

export default VideoCard;
