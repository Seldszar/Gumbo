import { IconPin } from "@tabler/icons-react";
import { useMemo } from "react";
import tw, { styled } from "twin.macro";

import { openUrl, t, template } from "~/common/helpers";
import { FollowedStream, HelixStream } from "~/common/types";

import { useClickAction } from "~/browser/hooks";

import Anchor from "../Anchor";
import Card from "../Card";
import ChannelName from "../ChannelName";
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
  ${tw`absolute bg-black/75 bottom-0 font-medium px-1 ltr:(right-0 rounded-tl) rtl:(left-0 rounded-tr) tabular-nums text-sm text-white`}
`;

const Title = styled.div`
  ${tw`flex gap-2`}
`;

const UserName = styled(ChannelName)`
  ${tw`flex-1 truncate`}
`;

const CategoryName = styled.div`
  ${tw`truncate`}
`;

export interface StreamCardProps {
  onTogglePinClick?(): void;
  isPinned?: boolean;
  stream: FollowedStream | HelixStream;
}

function StreamCard(props: StreamCardProps) {
  const { stream } = props;

  const startDate = useMemo(
    () => (stream.startedAt ? new Date(stream.startedAt) : null),
    [stream.startedAt]
  );

  const backgroundImage = useMemo(
    () => template(stream.thumbnailUrl, { "{width}": 96, "{height}": 54 }),
    [stream.thumbnailUrl]
  );

  const defaultAction = useClickAction(stream.userLogin);

  return (
    <Anchor to={defaultAction}>
      <Wrapper
        overflowMenu={{
          items: [
            {
              type: "normal",
              title: t("optionValue_openChannel"),
              onClick(event) {
                openUrl(`https://twitch.tv/${stream.userLogin}`, event);
              },
            },
            {
              type: "normal",
              title: t("optionValue_openChat"),
              onClick(event) {
                openUrl(`https://twitch.tv/${stream.userLogin}/chat`, event);
              },
            },
            {
              type: "normal",
              title: t("optionValue_popout"),
              onClick(event) {
                openUrl(`https://twitch.tv/${stream.userLogin}/popout`, event);
              },
            },
            {
              type: "separator",
            },
            {
              type: "checkbox",
              title: "Is Pinned",
              icon: <IconPin size="1.25rem" />,
              checked: pinnedUsers.includes(stream.userId),
              onChange() {
                toggle(stream.userId);
              },
            },
            {
              type: "separator",
            },
            {
              type: "normal",
              title: t("optionValue_about"),
              onClick(event) {
                openUrl(`https://twitch.tv/${stream.userLogin}/about`, event);
              },
            },
            {
              type: "normal",
              title: t("optionValue_schedule"),
              onClick(event) {
                openUrl(`https://twitch.tv/${stream.userLogin}/schedule`, event);
              },
            },
            {
              type: "normal",
              title: t("optionValue_videos"),
              onClick(event) {
                openUrl(`https://twitch.tv/${stream.userLogin}/videos`, event);
              },
            },
          ],
        }}
        titleProps={{
          children: (
            <Title>
              <UserName login={stream.userLogin} name={stream.userName} />
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
        <CategoryName title={stream.gameName}>
          {stream.gameName || <i>{t("detailText_noCategory")}</i>}
        </CategoryName>
      </Wrapper>
    </Anchor>
  );
}

export default StreamCard;
