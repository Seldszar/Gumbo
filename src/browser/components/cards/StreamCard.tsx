import React, { FC, HTMLAttributes, useMemo } from "react";
import tw, { styled } from "twin.macro";

import { openUrl, t, template } from "@/common/helpers";

import { useClickAction } from "@/browser/helpers/hooks";

import Anchor from "../Anchor";
import Card from "../Card";
import Image from "../Image";
import Uptime from "../Uptime";
import ViewerCount from "../ViewerCount";

const Wrapper = styled(Card)`
  ${tw`h-20`}
`;

const Thumbnail = styled.div`
  ${tw`bg-black overflow-hidden relative rounded shadow-md w-24`}
`;

const StyledStreamUptime = styled(Uptime)`
  ${tw`absolute bg-black/75 bottom-0 font-medium px-1 ltr:(right-0 rounded-tl) rtl:(left-0 rounded-tr) text-sm text-white`}

  font-feature-settings: "tnum";
`;

const Title = styled.div`
  ${tw`flex gap-2`}
`;

const UserName = styled.div`
  ${tw`flex-1 truncate`}
`;

const CategoryName = styled.div`
  ${tw`truncate`}
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
    () => template(stream.thumbnail_url, { "{width}": 96, "{height}": 54 }),
    [stream.thumbnail_url]
  );

  const defaultAction = useClickAction(stream.user_login);

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
        overflowMenu={{
          items: [
            {
              type: "link",
              children: t("optionValue_openChannel"),
              onClick(event) {
                openUrl(`https://twitch.tv/${stream.user_login}`, event);
              },
            },
            {
              type: "link",
              children: t("optionValue_openChat"),
              onClick(event) {
                openUrl(`https://twitch.tv/${stream.user_login}/chat`, event);
              },
            },
            {
              type: "link",
              children: t("optionValue_popout"),
              onClick(event) {
                openUrl(`https://twitch.tv/${stream.user_login}/popout`, event);
              },
            },
            {
              type: "separator",
            },
            {
              type: "link",
              children: t("optionValue_about"),
              onClick(event) {
                openUrl(`https://twitch.tv/${stream.user_login}/about`, event);
              },
            },
            {
              type: "link",
              children: t("optionValue_schedule"),
              onClick(event) {
                openUrl(`https://twitch.tv/${stream.user_login}/schedule`, event);
              },
            },
            {
              type: "link",
              children: t("optionValue_videos"),
              onClick(event) {
                openUrl(`https://twitch.tv/${stream.user_login}/videos`, event);
              },
            },
          ],
        }}
        titleProps={{
          children: (
            <Title>
              <UserName>{stream.user_name || stream.user_login}</UserName>
              <ViewerCount stream={stream} />
            </Title>
          ),
        }}
        subtitleProps={{
          children: stream.title || <i>{t("detailText_noTitle")}</i>,
          title: stream.title,
        }}
        aside={
          <Thumbnail>
            <Image src={backgroundImage} ratio={9 / 16} />
            {startDate && <StyledStreamUptime startDate={startDate} />}
          </Thumbnail>
        }
      >
        <CategoryName title={stream.game_name}>
          {stream.game_name || <i>{t("detailText_noCategory")}</i>}
        </CategoryName>
      </Wrapper>
    </Anchor>
  );
};

export default StreamCard;
