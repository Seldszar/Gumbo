import { useMemo } from "react";

import { t, template } from "~/common/helpers";
import { HelixStream } from "~/common/types";

import { useClickAction, useNow } from "~/browser/hooks";
import { styled } from "~/browser/styled-system/jsx";

import Anchor from "../Anchor";
import Card from "../Card";
import ChannelName from "../ChannelName";
import DropdownButton from "../DropdownButton";
import Image from "../Image";
import Tooltip from "../Tooltip";
import Uptime from "../Uptime";
import ViewerCount from "../ViewerCount";

import StreamDropdown from "../dropdowns/StreamDropdown";

const Thumbnail = styled("div", {
  base: {
    bg: "black",
    overflow: "hidden",
    pos: "relative",
    rounded: "sm",
    w: 24,
  },
});

const StyledStreamUptime = styled(Uptime, {
  base: {
    bg: "black/75",
    color: "white",
    bottom: 0,
    end: 0,
    fontSize: "sm",
    fontVariantNumeric: "tabular-nums",
    fontWeight: "medium",
    pos: "absolute",
    px: 1,
    roundedStartStart: "md",
  },
});

const Title = styled("div", {
  base: {
    display: "flex",
    gap: 2,
  },
});

const UserName = styled(ChannelName, {
  base: {
    flex: 1,
    truncate: true,
  },
});

const CategoryName = styled("div", {
  base: {
    truncate: true,
  },
});

const StyledDropdownButton = styled(DropdownButton, {
  base: {
    end: 6,
    pos: "absolute",
    visibility: { base: "hidden", _groupHover: "visible" },
    top: -2,
    zIndex: 20,
  },
});

const Wrapper = styled(Card, {
  base: {
    pos: "relative",
    py: 2,
  },
});

export interface StreamCardProps {
  stream: HelixStream;

  onNewCollection?(): void;
}

function StreamCard(props: StreamCardProps) {
  const { stream } = props;

  const defaultAction = useClickAction(stream.userLogin);
  const currentTime = useNow(60_000);

  const startDate = useMemo(
    () => (stream.startedAt ? new Date(stream.startedAt) : null),
    [stream.startedAt],
  );

  const previewImage = useMemo(() => {
    const url = new URL(
      template(stream.thumbnailUrl, {
        "{height}": 54,
        "{width}": 96,
      }),
    );

    url.searchParams.set("t", String(currentTime.getTime()));

    return url.href;
  }, [currentTime, stream.thumbnailUrl]);

  return (
    <Anchor to={defaultAction}>
      <Wrapper
        className="group"
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
