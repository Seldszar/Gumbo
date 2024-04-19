import { t } from "~/common/helpers";
import { HelixChannelSearchResult } from "~/common/types";

import { useClickAction } from "~/browser/hooks";
import { styled } from "~/browser/styled-system/jsx";

import Anchor from "../Anchor";
import Card from "../Card";
import DropdownButton from "../DropdownButton";
import ChannelName from "../ChannelName";
import Image from "../Image";
import Tooltip from "../Tooltip";

import ChannelDropdown from "../dropdowns/ChannelDropdown";

const StyledDropdownButton = styled(DropdownButton, {
  base: {
    end: 6,
    pos: "absolute",
    top: -2,
    visibility: { base: "hidden", _groupHover: "visible" },
    zIndex: 20,
  },
});

const Thumbnail = styled("div", {
  base: {
    bg: "black",
    overflow: "hidden",
    pos: "relative",
    rounded: "full",
    w: 12,
  },

  variants: {
    isLive: {
      true: {
        shadow: {
          base: "inset 0 0 0 2px {colors.red.500}, inset 0 0 0 4px {colors.white}",
          _dark: "inset 0 0 0 2px {colors.red.500}, inset 0 0 0 4px {colors.black}",
        },
      },
    },
  },
});

const CategoryName = styled("div", {
  base: {
    truncate: true,
  },
});

const Wrapper = styled(Card, {
  base: {
    pos: "relative",
    py: 2,
  },
});

export interface ChannelCardProps {
  channel: HelixChannelSearchResult;
}

function ChannelCard(props: ChannelCardProps) {
  const { channel } = props;

  const defaultAction = useClickAction(channel.broadcasterLogin);

  return (
    <Anchor to={defaultAction}>
      <Wrapper
        className="group"
        title={<ChannelName login={channel.broadcasterLogin} name={channel.displayName} />}
        subtitle={
          <Tooltip content={channel.title}>
            <span>{channel.title || <i>{t("detailText_noTitle")}</i>}</span>
          </Tooltip>
        }
        leftOrnament={
          <Thumbnail isLive={channel.isLive}>
            <Image src={channel.thumbnailUrl} ratio={1} />
          </Thumbnail>
        }
      >
        <CategoryName title={channel.gameName}>
          {channel.gameName || <i>{t("detailText_noCategory")}</i>}
        </CategoryName>

        <ChannelDropdown channel={channel}>
          <StyledDropdownButton />
        </ChannelDropdown>
      </Wrapper>
    </Anchor>
  );
}

export default ChannelCard;
