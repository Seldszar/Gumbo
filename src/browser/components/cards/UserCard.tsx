import React, { FC, HTMLAttributes, useMemo } from "react";
import tw, { css, styled } from "twin.macro";

import { openUrl, t } from "~/common/helpers";

import { useClickAction } from "~/browser/helpers/hooks";

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
    <Anchor to={defaultAction}>
      <Wrapper
        actionButtons={actionButtons}
        isLive={props.isLive}
        overflowMenu={{
          items: [
            {
              type: "link",
              children: t("optionValue_openChannel"),
              onClick(event) {
                openUrl(`https://twitch.tv/${user.login}`, event);
              },
            },
            {
              type: "link",
              children: t("optionValue_openChat"),
              onClick(event) {
                openUrl(`https://twitch.tv/${user.login}/chat`, event);
              },
            },
            {
              type: "link",
              children: t("optionValue_popout"),
              onClick(event) {
                openUrl(`https://twitch.tv/${user.login}/popout`, event);
              },
            },
            {
              type: "separator",
            },
            {
              type: "link",
              children: t("optionValue_about"),
              onClick(event) {
                openUrl(`https://twitch.tv/${user.login}/about`, event);
              },
            },
            {
              type: "link",
              children: t("optionValue_schedule"),
              onClick(event) {
                openUrl(`https://twitch.tv/${user.login}/schedule`, event);
              },
            },
            {
              type: "link",
              children: t("optionValue_videos"),
              onClick(event) {
                openUrl(`https://twitch.tv/${user.login}/videos`, event);
              },
            },
          ],
        }}
        titleProps={{
          children: <ChannelName login={user.login} name={user.display_name} />,
        }}
        subtitleProps={{
          children: user.description || <i>{t("detailText_noDescription")}</i>,
          title: user.description,
        }}
        aside={
          <Thumbnail>
            <Image src={user.profile_image_url} ratio={1} />
          </Thumbnail>
        }
      >
        {t("detailText_viewCount", user.view_count.toLocaleString())}
      </Wrapper>
    </Anchor>
  );
};

export default UserCard;
