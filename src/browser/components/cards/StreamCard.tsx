import React, { FC, useMemo } from "react";
import tw, { styled } from "twin.macro";

import ContextMenu from "../ContextMenu";
import Image from "../Image";
import Uptime from "../Uptime";

const StyledImage = styled(Image)``;

const Wrapper = styled.a`
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

const StyledStreamUptime = styled(Uptime)`
  ${tw`absolute bg-black/75 bottom-px flex font-medium px-1 right-px rounded`}

  font-feature-settings: "tnum";
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

const ViewerCount = styled.div`
  ${tw`ml-2 flex flex-none text-red-400`}

  font-feature-settings: "tnum";

  svg {
    ${tw`block fill-current mr-1 w-4`}
  }
`;

const StreamTitle = styled.div`
  ${tw`text-sm leading-tight text-white text-opacity-50 truncate`}
`;

const GameName = styled.div`
  ${tw`text-sm leading-tight text-white text-opacity-50 truncate`}
`;

const EllipsisButton = styled.button`
  ${tw`ml-3 -mr-1 p-1 text-white text-opacity-25 transition hover:text-opacity-100`}

  svg {
    ${tw`flex-none stroke-current w-5`}

    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 2px;
  }
`;

export interface StreamCardProps {
  stream: any;
}

const StreamCard: FC<StreamCardProps> = (props) => {
  const { stream } = props;

  const startDate = useMemo(
    () => (stream.started_at ? new Date(stream.started_at) : null),
    [stream.started_at]
  );

  const backgroundImage = useMemo(
    () => stream.thumbnail_url.replace("{width}", 96).replace("{height}", 54),
    [stream.thumbnail_url]
  );

  return (
    <Wrapper target="_blank" href={`https://twitch.tv/${stream.user_login}`}>
      <Thumbnail>
        <ThumbnailPicture>
          <StyledImage src={backgroundImage} />
          {startDate && <StyledStreamUptime startDate={startDate} />}
        </ThumbnailPicture>
      </Thumbnail>
      <Inner>
        <Title>
          <ChannelName>{stream.user_name || stream.user_login}</ChannelName>
          <ViewerCount>
            <svg viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 7a5 5 0 116.192 4.857A2 2 0 0013 13h1a3 3 0 013 3v2h-2v-2a1 1 0 00-1-1h-1a3.99 3.99 0 01-3-1.354A3.99 3.99 0 017 15H6a1 1 0 00-1 1v2H3v-2a3 3 0 013-3h1a2 2 0 001.808-1.143A5.002 5.002 0 015 7zm5 3a3 3 0 110-6 3 3 0 010 6z"
                clipRule="evenodd"
              />
            </svg>
            {stream.viewer_count.toLocaleString("en-US")}
          </ViewerCount>
        </Title>
        <StreamTitle title={stream.title}>{stream.title}</StreamTitle>
        <GameName title={stream.game_name}>{stream.game_name}</GameName>
      </Inner>
      <ContextMenu
        placement="bottom-end"
        menu={{
          items: [
            {
              type: "link",
              children: "Popout",
              onClick() {
                open(`https://twitch.tv/${stream.user_login}/popout`, "_blank");
              },
            },
            {
              type: "link",
              children: "Chat",
              onClick() {
                open(`https://twitch.tv/${stream.user_login}/chat`, "_blank");
              },
            },
            {
              type: "separator",
            },
            {
              type: "link",
              children: "About",
              onClick() {
                open(`https://twitch.tv/${stream.user_login}/about`, "_blank");
              },
            },
            {
              type: "link",
              children: "Schedule",
              onClick() {
                open(`https://twitch.tv/${stream.user_login}/schedule`, "_blank");
              },
            },
            {
              type: "link",
              children: "Videos",
              onClick() {
                open(`https://twitch.tv/${stream.user_login}/videos`, "_blank");
              },
            },
          ],
        }}
      >
        {(ref) => (
          <EllipsisButton ref={ref}>
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="19" r="1" />
              <circle cx="12" cy="5" r="1" />
            </svg>
          </EllipsisButton>
        )}
      </ContextMenu>
    </Wrapper>
  );
};

export default StreamCard;
