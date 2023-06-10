import { IconPin } from "@tabler/icons-react";
import { ReactNode } from "react";
import tw, { css, styled } from "twin.macro";

import { openUrl, t } from "~/common/helpers";
import { HelixUser } from "~/common/types";

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

export interface UserCardProps {
  onTogglePinClick?(): void;
  children?: ReactNode;
  isPinned?: boolean;
  isLive?: boolean;
  user: HelixUser;
}

function UserCard(props: UserCardProps) {
  const { user } = props;

  const defaultAction = useClickAction(user.login);

  return (
    <Anchor to={defaultAction}>
      <Wrapper
        isLive={props.isLive}
        overflowMenu={{
          items: [
            {
              type: "normal",
              title: t("optionValue_openChannel"),
              onClick(event) {
                openUrl(`https://twitch.tv/${user.login}`, event);
              },
            },
            {
              type: "normal",
              title: t("optionValue_openChat"),
              onClick(event) {
                openUrl(`https://twitch.tv/${user.login}/chat`, event);
              },
            },
            {
              type: "normal",
              title: t("optionValue_popout"),
              onClick(event) {
                openUrl(`https://twitch.tv/${user.login}/popout`, event);
              },
            },
            {
              type: "separator",
            },
            {
              type: "checkbox",
              title: "Is Pinned",
              icon: <IconPin size="1.25rem" />,
              checked: !!props.isPinned,
              onChange() {
                props.onTogglePinClick?.();
              },
            },
            {
              type: "separator",
            },
            {
              type: "normal",
              title: t("optionValue_about"),
              onClick(event) {
                openUrl(`https://twitch.tv/${user.login}/about`, event);
              },
            },
            {
              type: "normal",
              title: t("optionValue_schedule"),
              onClick(event) {
                openUrl(`https://twitch.tv/${user.login}/schedule`, event);
              },
            },
            {
              type: "normal",
              title: t("optionValue_videos"),
              onClick(event) {
                openUrl(`https://twitch.tv/${user.login}/videos`, event);
              },
            },
          ],
        }}
        titleProps={{
          children: <ChannelName login={user.login} name={user.displayName} />,
        }}
        subtitleProps={{
          children: user.description || <i>{t("detailText_noDescription")}</i>,
          title: user.description,
        }}
        aside={
          <Thumbnail>
            <Image src={user.profileImageUrl} ratio={1} />
          </Thumbnail>
        }
      >
        {props.children}
      </Wrapper>
    </Anchor>
  );
}

export default UserCard;
