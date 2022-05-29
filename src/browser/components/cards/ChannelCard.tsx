import React, { FC } from "react";
import tw, { css, styled } from "twin.macro";

import { openUrl, t } from "@/common/helpers";

import { useClickAction } from "@/browser/helpers/hooks";

import Card from "../Card";
import Image from "../Image";

export interface WrapperProps {
  isLive?: boolean;
}

const Wrapper = styled(Card)<WrapperProps>`
  ${tw`flex h-20 items-center px-4`}

  ${(props) =>
    props.isLive &&
    css`
      ${Thumbnail} {
        ${tw`ring-2 ring-offset-2 ring-offset-neutral-900 ring-red-500`}
      }
    `}
`;

const Thumbnail = styled.div`
  ${tw`bg-black flex-none ltr:mr-4 rtl:ml-4 overflow-hidden relative rounded-full shadow-md w-12`}
`;

const Inner = styled.div`
  ${tw`flex-1 overflow-hidden`}
`;

const UserName = styled.div`
  ${tw`font-medium truncate`}
`;

const CategoryName = styled.div`
  ${tw`font-medium -mt-1 text-black/50 dark:text-white/50 text-xs truncate`}
`;

const ChannelTitle = styled.div`
  ${tw`mt-px text-black/50 dark:text-white/50 text-sm truncate`}
`;

export interface ChannelCardProps {
  channel: any;
}

const ChannelCard: FC<ChannelCardProps> = (props) => {
  const { channel } = props;

  const defaultAction = useClickAction(channel.broadcaster_login);

  return (
    <Wrapper
      to={defaultAction}
      isLive={channel.is_live}
      ellipsisMenu={{
        items: [
          {
            type: "link",
            children: t("optionValue_openChannel"),
            onClick(event) {
              openUrl(`https://twitch.tv/${channel.broadcaster_login}`, event);
            },
          },
          {
            type: "link",
            children: t("optionValue_openChat"),
            onClick(event) {
              openUrl(`https://twitch.tv/${channel.broadcaster_login}/chat`, event);
            },
          },
          {
            type: "link",
            children: t("optionValue_popout"),
            onClick(event) {
              openUrl(`https://twitch.tv/${channel.broadcaster_login}/popout`, event);
            },
          },
          {
            type: "separator",
          },
          {
            type: "link",
            children: t("optionValue_about"),
            onClick(event) {
              openUrl(`https://twitch.tv/${channel.broadcaster_login}/about`, event);
            },
          },
          {
            type: "link",
            children: t("optionValue_schedule"),
            onClick(event) {
              openUrl(`https://twitch.tv/${channel.broadcaster_login}/schedule`, event);
            },
          },
          {
            type: "link",
            children: t("optionValue_videos"),
            onClick(event) {
              openUrl(`https://twitch.tv/${channel.broadcaster_login}/videos`, event);
            },
          },
        ],
      }}
    >
      <Thumbnail>
        <Image src={channel.thumbnail_url} ratio={1} />
      </Thumbnail>
      <Inner>
        <UserName>{channel.display_name || channel.broadcaster_login}</UserName>
        <CategoryName title={channel.game_name}>{channel.game_name}</CategoryName>
        <ChannelTitle title={channel.title}>{channel.title}</ChannelTitle>
      </Inner>
    </Wrapper>
  );
};

export default ChannelCard;
