import React, { FC, useMemo } from "react";
import tw, { styled } from "twin.macro";

import { t, template } from "@/common/helpers";

import { parseFormatDuration } from "@/browser/helpers/time";

import Card from "../Card";
import Image from "../Image";

const Wrapper = styled(Card)`
  ${tw`flex h-20 items-center px-4`}
`;

const Thumbnail = styled.div`
  ${tw`bg-black flex-none ltr:mr-4 rtl:ml-4 overflow-hidden relative rounded shadow-md w-24`}
`;

const VideoDuration = styled.div`
  ${tw`absolute bg-black/75 bottom-0 font-medium px-1 ltr:(right-0 rounded-tl) rtl:(left-0 rounded-tr) text-sm text-white`}

  font-feature-settings: "tnum";
`;

const Inner = styled.div`
  ${tw`flex-1 overflow-hidden`}
`;

const Title = styled.div`
  ${tw`font-medium truncate`}
`;

const UserName = styled.div`
  ${tw`font-medium -mt-1 text-black/50 dark:text-white/50 text-xs truncate`}
`;

const Details = styled.ul`
  ${tw`flex gap-4 mt-px text-black/50 dark:text-white/50 text-sm truncate`}
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
    <Wrapper to={video.url}>
      <Thumbnail>
        <Image src={previewImage} ratio={9 / 16} />
        <VideoDuration>{durationString}</VideoDuration>
      </Thumbnail>
      <Inner>
        <Title title={video.title}>{video.title}</Title>
        <UserName>{video.user_name || video.user_login}</UserName>
        <Details>
          <li>{createdAt.toLocaleString()}</li>
          <li>{t("detailText_viewCount", video.view_count.toLocaleString())}</li>
        </Details>
      </Inner>
    </Wrapper>
  );
};

export default VideoCard;
