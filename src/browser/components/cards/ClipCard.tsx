import React, { FC, useMemo } from "react";
import tw, { styled } from "twin.macro";

import { formatTime } from "@/browser/helpers/time";

import Anchor from "../Anchor";
import Image from "../Image";

const StyledImage = styled(Image)``;

const Wrapper = styled(Anchor)`
  ${tw`cursor-pointer flex items-center px-4 py-2 h-20 hover:bg-white/10`}
`;

const Thumbnail = styled.div`
  ${tw`flex-none mr-4`}
`;

const ThumbnailPicture = styled.div`
  ${tw`bg-black overflow-hidden relative rounded shadow text-sm w-24`}

  padding-top: 56.25%;

  ${StyledImage} {
    ${tw`absolute h-full inset-0 object-cover w-full`}
  }
`;

const Duration = styled.div`
  ${tw`absolute bg-black/75 bottom-px flex font-medium px-1 right-px rounded`}

  font-feature-settings: "tnum";
`;

const Inner = styled.div`
  ${tw`flex-1 overflow-hidden`}
`;

const Title = styled.div`
  ${tw`font-medium truncate`}
`;

const StreamTitle = styled.div`
  ${tw`text-sm leading-tight text-white text-opacity-50 truncate`}
`;

const Details = styled.ul`
  ${tw`flex -mx-2`}

  li {
    ${tw`text-sm leading-tight mx-2 text-white text-opacity-50 truncate`}
  }
`;

export interface ClipCardProps {
  clip: any;
}

const ClipCard: FC<ClipCardProps> = (props) => {
  const { clip } = props;

  const previewImage = useMemo(
    () => clip.thumbnail_url.replace("{width}", 96).replace("{height}", 54),
    [clip.thumbnail_url]
  );

  const createdAt = useMemo(() => new Date(clip.created_at), [clip.created_at]);
  const timeString = useMemo(() => formatTime(clip.duration * 1000), [clip.duration]);

  return (
    <Wrapper target="_blank" href={clip.url}>
      <Thumbnail>
        <ThumbnailPicture>
          <StyledImage src={previewImage} />
          <Duration>{timeString}</Duration>
        </ThumbnailPicture>
      </Thumbnail>
      <Inner>
        <Title title={clip.title}>{clip.title}</Title>
        <StreamTitle title={clip.broadcaster_name}>{clip.broadcaster_name}</StreamTitle>
        <Details>
          <li>{createdAt?.toLocaleString()}</li>
          <li>{clip.view_count} views</li>
        </Details>
      </Inner>
    </Wrapper>
  );
};

export default ClipCard;
