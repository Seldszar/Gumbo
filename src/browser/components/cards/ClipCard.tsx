import { FC, useMemo } from "react";
import tw, { styled } from "twin.macro";

import { t, template } from "~/common/helpers";
import { HelixClip } from "~/common/types";

import { formatTime } from "~/browser/helpers";

import Anchor from "../Anchor";
import Card from "../Card";
import Image from "../Image";

const Wrapper = styled(Card)`
  ${tw`h-20`}
`;

const Thumbnail = styled.div`
  ${tw`bg-black overflow-hidden relative rounded shadow-md w-24`}
`;

const Duration = styled.div`
  ${tw`absolute bg-black/75 bottom-0 font-medium px-1 ltr:(right-0 rounded-tl) rtl:(left-0 rounded-tr) text-sm text-white`}

  font-feature-settings: "tnum";
`;

const Details = styled.ul`
  ${tw`flex gap-4`}
`;

export interface ClipCardProps {
  clip: HelixClip;
}

const ClipCard: FC<ClipCardProps> = (props) => {
  const { clip } = props;

  const previewImage = useMemo(
    () => template(clip.thumbnailUrl, { "{width}": 96, "{height}": 54 }),
    [clip.thumbnailUrl]
  );

  const createdAt = useMemo(() => new Date(clip.createdAt), [clip.createdAt]);
  const timeString = useMemo(() => formatTime(clip.duration * 1000), [clip.duration]);

  return (
    <Anchor to={clip.url}>
      <Wrapper
        titleProps={{
          children: clip.title || <i>{t("detailText_noTitle")}</i>,
          title: clip.title,
        }}
        subtitleProps={{
          children: clip.broadcasterName,
        }}
        aside={
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
};

export default ClipCard;
