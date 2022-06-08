import React, { FC, useMemo } from "react";
import tw, { styled } from "twin.macro";

import { t, template } from "@/common/helpers";

import { parseFormatDuration } from "@/browser/helpers/time";

import Anchor from "../Anchor";
import Card from "../Card";
import ChannelName from "../ChannelName";
import Image from "../Image";

const Wrapper = styled(Card)`
  ${tw`h-20`}
`;

const Thumbnail = styled.div`
  ${tw`bg-black overflow-hidden relative rounded shadow-md w-24`}
`;

const VideoDuration = styled.div`
  ${tw`absolute bg-black/75 bottom-0 font-medium px-1 ltr:(right-0 rounded-tl) rtl:(left-0 rounded-tr) text-sm text-white`}

  font-feature-settings: "tnum";
`;

const Details = styled.ul`
  ${tw`flex gap-4`}
`;

export interface VideoCardProps {
  video: any;
}

const VideoCard: FC<VideoCardProps> = (props) => {
  const { video } = props;

  const previewImage = useMemo(
    () => template(video.thumbnail_url, { "%{width}": 96, "%{height}": 54 }),
    [video.thumbnail_url]
  );

  const createdAt = useMemo(() => new Date(video.created_at), [video.created_at]);
  const durationString = useMemo(() => parseFormatDuration(video.duration), [video.duration]);

  return (
    <Anchor to={video.url}>
      <Wrapper
        titleProps={{
          children: video.title || <i>{t("detailText_noTitle")}</i>,
          title: video.title,
        }}
        subtitleProps={{
          children: <ChannelName login={video.user_login} name={video.user_name} />,
        }}
        aside={
          <Thumbnail>
            <Image src={previewImage} ratio={9 / 16} />
            <VideoDuration>{durationString}</VideoDuration>
          </Thumbnail>
        }
      >
        <Details>
          <li>{createdAt.toLocaleString()}</li>
          <li>{t("detailText_viewCount", video.view_count.toLocaleString())}</li>
        </Details>
      </Wrapper>
    </Anchor>
  );
};

export default VideoCard;
