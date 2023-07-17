import { useMemo } from "react";
import tw, { styled } from "twin.macro";

import { t, template } from "~/common/helpers";
import { FollowedStream, HelixStream } from "~/common/types";

import { useClickAction, useNow } from "~/browser/hooks";

import Anchor from "../Anchor";
import Card from "../Card";
import ChannelName from "../ChannelName";
import DropdownButton from "../DropdownButton";
import Image from "../Image";
import Tooltip from "../Tooltip";
import Uptime from "../Uptime";
import ViewerCount from "../ViewerCount";

import StreamDropdown from "../dropdowns/StreamDropdown";

const Thumbnail = styled.div`
  ${tw`bg-black overflow-hidden relative rounded w-24`}
`;

const StyledStreamUptime = styled(Uptime)`
  ${tw`absolute bg-black/75 bottom-0 font-medium px-1 end-0 rounded-ss tabular-nums text-sm text-white`}
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

const StyledDropdownButton = styled(DropdownButton)`
  ${tw`absolute invisible end-6 -top-2 z-20`}
`;

const Wrapper = styled(Card)`
  ${tw`py-2 relative`}

  :hover ${StyledDropdownButton} {
    ${tw`visible`}
  }
`;

export interface StreamCardProps {
  stream: FollowedStream | HelixStream;

  onNewCollection?(): void;
}

function StreamCard(props: StreamCardProps) {
  const { stream } = props;

  const defaultAction = useClickAction(stream.userLogin);
  const currentTime = useNow(60_000);

  const startDate = useMemo(
    () => (stream.startedAt ? new Date(stream.startedAt) : null),
    [stream.startedAt]
  );

  const previewImage = useMemo(() => {
    const url = new URL(
      template(stream.thumbnailUrl, {
        "{height}": 54,
        "{width}": 96,
      })
    );

    url.searchParams.set("t", String(currentTime.getTime()));

    return url.href;
  }, [currentTime, stream.thumbnailUrl]);

  return (
    <Anchor to={defaultAction}>
      <Wrapper
        title={
          <Title>
            <UserName login={stream.userLogin} name={stream.userName} />
            <ViewerCount stream={stream} />
          </Title>
        }
        subtitle={
          <Tooltip content={stream.title}>
            <span>{stream.title || <i>{t("detailText_noTitle")}</i>}</span>
          </Tooltip>
        }
        leftOrnament={
          <Thumbnail>
            <Image src={previewImage} ratio={9 / 16} />
            {startDate && <StyledStreamUptime startDate={startDate} />}
          </Thumbnail>
        }
      >
        <CategoryName>
          <Tooltip content={stream.gameName}>
            <span>{stream.gameName || <i>{t("detailText_noCategory")}</i>}</span>
          </Tooltip>
        </CategoryName>

        <StreamDropdown stream={stream} onNewCollection={props.onNewCollection}>
          <StyledDropdownButton />
        </StreamDropdown>
      </Wrapper>
    </Anchor>
  );
}

export default StreamCard;
