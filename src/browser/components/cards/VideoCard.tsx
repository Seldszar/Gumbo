import { useMemo } from "react";
import tw, { styled } from "twin.macro";

import { t, template } from "~/common/helpers";
import { HelixVideo } from "~/common/types";

import { parseFormatDuration } from "~/browser/helpers";

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
  video: HelixVideo;
}

function VideoCard(props: VideoCardProps) {
  const { video } = props;

  const previewImage = useMemo(
    () => template(video.thumbnailUrl, { "%{width}": 96, "%{height}": 54 }),
    [video.thumbnailUrl]
  );

  const createdAt = useMemo(() => new Date(video.createdAt), [video.createdAt]);
  const durationString = useMemo(() => parseFormatDuration(video.duration), [video.duration]);

  return (
    <Anchor to={video.url}>
      <Wrapper
        titleProps={{
          children: video.title || <i>{t("detailText_noTitle")}</i>,
          title: video.title,
        }}
        subtitleProps={{
          children: <ChannelName login={video.userLogin} name={video.userName} />,
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
          <li>{t("detailText_viewCount", video.viewCount.toLocaleString())}</li>
        </Details>
      </Wrapper>
    </Anchor>
  );
}

export default VideoCard;
