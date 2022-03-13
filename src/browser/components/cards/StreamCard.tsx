import React, { FC, HTMLAttributes, useMemo } from "react";
import tw, { styled } from "twin.macro";

import Card from "../Card";
import Image from "../Image";
import Uptime from "../Uptime";
import ViewerCount from "../ViewerCount";

const StyledImage = styled(Image)``;

const Wrapper = styled(Card)`
  ${tw`flex items-center px-4 py-2 h-20`}
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

export interface StreamCardProps {
  onTogglePinClick?(): void;
  isPinned?: boolean;
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

  const actionButtons = useMemo(() => {
    const result = new Array<HTMLAttributes<HTMLButtonElement>>();

    if (props.onTogglePinClick) {
      result.push({
        onClick(event) {
          event.stopPropagation();
          event.preventDefault();

          props.onTogglePinClick?.();
        },
        children: props.isPinned ? (
          <svg viewBox="0 0 24 24">
            <line x1="3" y1="3" x2="21" y2="21" />
            <path d="M15 4.5l-3.249 3.249m-2.57 1.433l-2.181 .818l-1.5 1.5l7 7l1.5 -1.5l.82 -2.186m1.43 -2.563l3.25 -3.251" />
            <line x1="9" y1="15" x2="4.5" y2="19.5" />
            <line x1="14.5" y1="4" x2="20" y2="9.5" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24">
            <path d="M15 4.5l-4 4l-4 1.5l-1.5 1.5l7 7l1.5 -1.5l1.5 -4l4 -4" />
            <line x1="9" y1="15" x2="4.5" y2="19.5" />
            <line x1="14.5" y1="4" x2="20" y2="9.5" />
          </svg>
        ),
      });
    }

    return result;
  }, [props.isPinned, props.onTogglePinClick]);

  return (
    <Wrapper
      to={`https://twitch.tv/${stream.user_login}`}
      actionButtons={actionButtons}
      ellipsisMenu={{
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
    </Wrapper>
  );
};

export default StreamCard;
