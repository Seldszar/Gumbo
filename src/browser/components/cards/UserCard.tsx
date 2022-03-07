import React, { FC } from "react";
import tw, { css, styled } from "twin.macro";

import Anchor from "../Anchor";
import ContextMenu from "../ContextMenu";

export interface WrapperProps {
  isLive?: boolean;
}

const Wrapper = styled(Anchor)<WrapperProps>`
  ${tw`cursor-pointer flex items-center px-4 py-2 hover:bg-white/10`}

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

export interface UserCardProps {
  isLive?: boolean;
  user: any;
}

const UserCard: FC<UserCardProps> = (props) => {
  const { user } = props;

  return (
    <Wrapper target="_blank" href={`https://twitch.tv/${user.login}`} isLive={props.isLive}>
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
      <ContextMenu
        placement="bottom-end"
        menu={{
          items: [
            {
              type: "link",
              children: "Popout",
              onClick() {
                open(`https://twitch.tv/${user.login}/popout`, "_blank");
              },
            },
            {
              type: "link",
              children: "Chat",
              onClick() {
                open(`https://twitch.tv/${user.login}/chat`, "_blank");
              },
            },
            {
              type: "separator",
            },
            {
              type: "link",
              children: "About",
              onClick() {
                open(`https://twitch.tv/${user.login}/about`, "_blank");
              },
            },
            {
              type: "link",
              children: "Schedule",
              onClick() {
                open(`https://twitch.tv/${user.login}/schedule`, "_blank");
              },
            },
            {
              type: "link",
              children: "Videos",
              onClick() {
                open(`https://twitch.tv/${user.login}/videos`, "_blank");
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

export default UserCard;
