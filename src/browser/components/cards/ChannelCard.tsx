import React, { FC } from "react";
import tw, { css, styled } from "twin.macro";

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
  ${tw`flex-none mr-4`}
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

  return (
    <Wrapper
      to={`https://twitch.tv/${channel.broadcaster_login}`}
      isLive={channel.is_live}
      ellipsisMenu={{
        items: [
          {
            type: "link",
            children: "Popout",
            onClick() {
              open(`https://twitch.tv/${channel.broadcaster_login}/popout`, "_blank");
            },
          },
          {
            type: "link",
            children: "Chat",
            onClick() {
              open(`https://twitch.tv/${channel.broadcaster_login}/chat`, "_blank");
            },
          },
          {
            type: "separator",
          },
          {
            type: "link",
            children: "About",
            onClick() {
              open(`https://twitch.tv/${channel.broadcaster_login}/about`, "_blank");
            },
          },
          {
            type: "link",
            children: "Schedule",
            onClick() {
              open(`https://twitch.tv/${channel.broadcaster_login}/schedule`, "_blank");
            },
          },
          {
            type: "link",
            children: "Videos",
            onClick() {
              open(`https://twitch.tv/${channel.broadcaster_login}/videos`, "_blank");
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
