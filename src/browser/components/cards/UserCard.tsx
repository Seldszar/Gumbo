import React, { FC, HTMLAttributes, useMemo } from "react";
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

const Detail = styled.div`
  ${tw`text-sm leading-tight text-black/50 dark:text-white/50 truncate`}
`;

export interface UserCardProps {
  onTogglePinClick?(): void;
  isPinned?: boolean;
  isLive?: boolean;
  user: any;
}

const UserCard: FC<UserCardProps> = (props) => {
  const { user } = props;

  const defaultAction = useClickAction(user.login);

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
      to={defaultAction}
      actionButtons={actionButtons}
      isLive={props.isLive}
      ellipsisMenu={{
        items: [
          {
            type: "link",
            children: "Open channel",
            onClick(event) {
              openUrl(`https://twitch.tv/${user.login}`, event);
            },
          },
          {
            type: "link",
            children: "Open chat",
            onClick(event) {
              openUrl(`https://twitch.tv/${user.login}/chat`, event);
            },
          },
          {
            type: "link",
            children: "Popout",
            onClick(event) {
              openUrl(`https://twitch.tv/${user.login}/popout`, event);
            },
          },
          {
            type: "separator",
          },
          {
            type: "link",
            children: "About",
            onClick(event) {
              openUrl(`https://twitch.tv/${user.login}/about`, event);
            },
          },
          {
            type: "link",
            children: "Schedule",
            onClick(event) {
              openUrl(`https://twitch.tv/${user.login}/schedule`, event);
            },
          },
          {
            type: "link",
            children: "Videos",
            onClick(event) {
              openUrl(`https://twitch.tv/${user.login}/videos`, event);
            },
          },
        ],
      }}
    >
      <Thumbnail>
        <ThumbnailImage style={{ backgroundImage: `url("${user.profile_image_url}")` }} />
      </Thumbnail>
      <Inner>
        <Title>
          <ChannelName>{user.display_name || user.login}</ChannelName>
        </Title>
        <Detail title={user.description}>{user.description || "No description"}</Detail>
        <Detail>{user.view_count.toLocaleString()} views</Detail>
      </Inner>
    </Wrapper>
  );
};

export default UserCard;
