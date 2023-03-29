import { FC, useMemo } from "react";
import tw, { styled } from "twin.macro";

import { t, template } from "~/common/helpers";

import { formatTime } from "~/browser/helpers/time";

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
  clip: any;
}

const ClipCard: FC<ClipCardProps> = (props) => {
  const { clip } = props;

  const previewImage = useMemo(
    () => template(clip.thumbnail_url, { "{width}": 96, "{height}": 54 }),
    [clip.thumbnail_url]
  );

  const createdAt = useMemo(() => new Date(clip.created_at), [clip.created_at]);
  const timeString = useMemo(() => formatTime(clip.duration * 1000), [clip.duration]);

  return (
    <Anchor to={clip.url}>
      <Wrapper
        titleProps={{
          children: clip.title || <i>{t("detailText_noTitle")}</i>,
          title: clip.title,
        }}
        subtitleProps={{
          children: clip.broadcaster_name,
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
          <li>{t("detailText_viewCount", clip.view_count.toLocaleString())}</li>
        </Details>
      </Wrapper>
    </Anchor>
  );
};

export default ClipCard;
