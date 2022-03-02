import React, { FC, useMemo } from "react";
import tw, { styled } from "twin.macro";

import Anchor from "../Anchor";
import ContextMenu from "../ContextMenu";
import Image from "../Image";
import Uptime from "../Uptime";
import ViewerCount from "../ViewerCount";

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

const StyledViewerCount = styled(ViewerCount)`
  ${tw`ml-2 flex-none`}
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
          <StyledViewerCount stream={stream} />
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
