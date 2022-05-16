import React, { FC } from "react";
import tw, { css, styled } from "twin.macro";

import { openUrl } from "@/common/helpers";

import { useClickAction } from "@/browser/helpers/hooks";

import Card from "../Card";

export interface WrapperProps {
  isLive?: boolean;
}

const Wrapper = styled(Card)<WrapperProps>`
  ${tw`flex items-center px-4 py-2`}

  ${(props) =>
    props.isLive &&
    css`
      ${ThumbnailImage} {
        ${tw`ring-2 ring-offset-2 ring-offset-neutral-900 ring-red-500`}
      }
    `}
`;

const Thumbnail = styled.div`
  ${tw`flex-none ltr:mr-4 rtl:ml-4`}
`;

const ThumbnailImage = styled.div`
  ${tw`bg-black bg-center bg-cover h-12 rounded-full text-sm w-12`}
`;

const Inner = styled.div`
  ${tw`flex-1 overflow-hidden`}
`;

const Title = styled.div`
  ${tw`flex font-medium`}
`;

const ChannelName = styled.div`
  ${tw`flex-1 truncate`}
`;

const StreamTitle = styled.div`
  ${tw`text-sm leading-tight text-black/50 dark:text-white/50 truncate`}
`;

const GameName = styled.div`
  ${tw`text-sm leading-tight text-black/50 dark:text-white/50 truncate`}
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
            children: "Open channel",
            onClick(event) {
              openUrl(`https://twitch.tv/${channel.broadcaster_login}`, event);
            },
          },
          {
            type: "link",
            children: "Open chat",
            onClick(event) {
              openUrl(`https://twitch.tv/${channel.broadcaster_login}/chat`, event);
            },
          },
          {
            type: "link",
            children: "Popout",
            onClick(event) {
              openUrl(`https://twitch.tv/${channel.broadcaster_login}/popout`, event);
            },
          },
          {
            type: "separator",
          },
          {
            type: "link",
            children: "About",
            onClick(event) {
              openUrl(`https://twitch.tv/${channel.broadcaster_login}/about`, event);
            },
          },
          {
            type: "link",
            children: "Schedule",
            onClick(event) {
              openUrl(`https://twitch.tv/${channel.broadcaster_login}/schedule`, event);
            },
          },
          {
            type: "link",
            children: "Videos",
            onClick(event) {
              openUrl(`https://twitch.tv/${channel.broadcaster_login}/videos`, event);
            },
          },
        ],
      }}
    >
      <Thumbnail>
        <ThumbnailImage style={{ backgroundImage: `url("${channel.thumbnail_url}")` }} />
      </Thumbnail>
      <Inner>
        <Title>
          <ChannelName>{channel.display_name || channel.broadcaster_login}</ChannelName>
        </Title>
        <StreamTitle title={channel.title}>{channel.title}</StreamTitle>
        <GameName title={channel.game_name}>{channel.game_name}</GameName>
      </Inner>
    </Wrapper>
  );
};

export default ChannelCard;
