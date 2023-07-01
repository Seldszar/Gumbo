import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";
import { HelixChannelSearchResult } from "~/common/types";

import { useClickAction } from "~/browser/hooks";

import Anchor from "../Anchor";
import Card from "../Card";
import DropdownButton from "../DropdownButton";
import ChannelName from "../ChannelName";
import Image from "../Image";
import Tooltip from "../Tooltip";

import ChannelDropdown from "../dropdowns/ChannelDropdown";

const StyledDropdownButton = styled(DropdownButton)`
  ${tw`absolute invisible end-6 -top-2 z-20`}
`;

const Thumbnail = styled.div`
  ${tw`bg-black overflow-hidden relative rounded-full w-12`}
`;

const CategoryName = styled.div`
  ${tw`truncate`}
`;

export interface WrapperProps {
  isLive?: boolean;
}

const Wrapper = styled(Card)<WrapperProps>`
  ${tw`py-2 relative`}

  ${Thumbnail} {
    ${(props) =>
      props.isLive &&
      tw`ring-2 ring-offset-2 ring-offset-white ring-red-500 dark:ring-offset-black`}
  }

  &:hover ${StyledDropdownButton} {
    ${tw`visible`}
  }
`;

export interface ChannelCardProps {
  channel: HelixChannelSearchResult;
}

function ChannelCard(props: ChannelCardProps) {
  const { channel } = props;

  const defaultAction = useClickAction(channel.broadcasterLogin);

  return (
    <Anchor to={defaultAction}>
      <Wrapper
        isLive={channel.isLive}
        title={<ChannelName login={channel.broadcasterLogin} name={channel.displayName} />}
        subtitle={
          <Tooltip content={channel.title}>
            <span>{channel.title || <i>{t("detailText_noTitle")}</i>}</span>
          </Tooltip>
        }
        leftOrnament={
          <Thumbnail>
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
