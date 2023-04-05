import tw, { css, styled } from "twin.macro";

import { openUrl, t } from "~/common/helpers";
import { HelixChannelSearchResult } from "~/common/types";

import { useClickAction } from "~/browser/hooks";

import Anchor from "../Anchor";
import Card from "../Card";
import ChannelName from "../ChannelName";
import Image from "../Image";

export interface WrapperProps {
  isLive?: boolean;
}

const Wrapper = styled(Card)<WrapperProps>`
  ${tw`h-20`}

  ${(props) =>
    props.isLive &&
    css`
      ${Thumbnail} {
        ${tw`ring-2 ring-offset-2 ring-offset-neutral-900 ring-red-500`}
      }
    `}
`;

const Thumbnail = styled.div`
  ${tw`bg-black overflow-hidden relative rounded-full shadow-md w-12`}
`;

const CategoryName = styled.div`
  ${tw`truncate`}
`;

export interface ChannelCardProps {
  channel: HelixChannelSearchResult;
}

function ChannelCard(props: ChannelCardProps) {
  const { channel } = props;

  const defaultAction = useClickAction(channel.broadcasterLogin);

  return (
    <Anchor to={defaultAction}>
      <Wrapper
        isLive={channel.isLive}
        overflowMenu={{
          items: [
            {
              type: "link",
              children: t("optionValue_openChannel"),
              onClick(event) {
                openUrl(`https://twitch.tv/${channel.broadcasterLogin}`, event);
              },
            },
            {
              type: "link",
              children: t("optionValue_openChat"),
              onClick(event) {
                openUrl(`https://twitch.tv/${channel.broadcasterLogin}/chat`, event);
              },
            },
            {
              type: "link",
              children: t("optionValue_popout"),
              onClick(event) {
                openUrl(`https://twitch.tv/${channel.broadcasterLogin}/popout`, event);
              },
            },
            {
              type: "separator",
            },
            {
              type: "link",
              children: t("optionValue_about"),
              onClick(event) {
                openUrl(`https://twitch.tv/${channel.broadcasterLogin}/about`, event);
              },
            },
            {
              type: "link",
              children: t("optionValue_schedule"),
              onClick(event) {
                openUrl(`https://twitch.tv/${channel.broadcasterLogin}/schedule`, event);
              },
            },
            {
              type: "link",
              children: t("optionValue_videos"),
              onClick(event) {
                openUrl(`https://twitch.tv/${channel.broadcasterLogin}/videos`, event);
              },
            },
          ],
        }}
        titleProps={{
          children: <ChannelName login={channel.broadcasterLogin} name={channel.displayName} />,
        }}
        subtitleProps={{
          children: channel.title || <i>{t("detailText_noTitle")}</i>,
          title: channel.title,
        }}
        aside={
          <Thumbnail>
            <Image src={channel.thumbnailUrl} ratio={1} />
          </Thumbnail>
        }
      >
        <CategoryName title={channel.gameName}>
          {channel.gameName || <i>{t("detailText_noCategory")}</i>}
        </CategoryName>
      </Wrapper>
    </Anchor>
  );
}

export default ChannelCard;
