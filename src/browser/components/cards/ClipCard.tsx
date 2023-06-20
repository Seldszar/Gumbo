import { useMemo } from "react";
import tw, { styled } from "twin.macro";

import { t, template } from "~/common/helpers";
import { HelixClip } from "~/common/types";

import { formatTime } from "~/browser/helpers";

import Anchor from "../Anchor";
import Card from "../Card";
import Image from "../Image";
import Tooltip from "../Tooltip";

const Thumbnail = styled.div`
  ${tw`bg-black overflow-hidden relative rounded w-24`}
`;

const Duration = styled.div`
  ${tw`absolute bg-black/75 bottom-0 font-medium px-1 end-0 rounded-ss tabular-nums text-sm text-white`}
`;

const Details = styled.ul`
  ${tw`flex gap-4`}
`;

const Wrapper = styled(Card)`
  ${tw`h-20`}
`;

export interface ClipCardProps {
  clip: HelixClip;
}

function ClipCard(props: ClipCardProps) {
  const { clip } = props;

  const previewImage = useMemo(
    () => template(clip.thumbnailUrl, { "{height}": 54, "{width}": 96 }),
    [clip.thumbnailUrl]
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
