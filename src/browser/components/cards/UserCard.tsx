import { ReactNode } from "react";

import { t } from "~/common/helpers";
import { HelixUser } from "~/common/types";

import { useClickAction } from "~/browser/hooks";
import { styled } from "~/browser/styled-system/jsx";

import Anchor from "../Anchor";
import Card from "../Card";
import ChannelName from "../ChannelName";
import DropdownButton from "../DropdownButton";
import Image from "../Image";
import Tooltip from "../Tooltip";

import UserDropdown from "../dropdowns/UserDropdown";

const Thumbnail = styled("div", {
  base: {
    bg: "black",
    overflow: "hidden",
    pos: "relative",
    rounded: "full",
    w: 12,
  },

  variants: {
    type: {
      live: {
        shadow: {
          base: "inset 0 0 0 2px {colors.red.600}, inset 0 0 0 4px {colors.white}",
          _dark: "inset 0 0 0 2px {colors.red.400}, inset 0 0 0 4px {colors.black}",
        },
      },

      rerun: {
        shadow: {
          base: "inset 0 0 0 2px {colors.neutral.600}, inset 0 0 0 4px {colors.white}",
          _dark: "inset 0 0 0 2px {colors.neutral.400}, inset 0 0 0 4px {colors.black}",
        },
      },
    },
  },
});

const StyledDropdownButton = styled(DropdownButton, {
  base: {
    end: 6,
    pos: "absolute",
    top: -2,
    visibility: { base: "hidden", _groupHover: "visible" },
    zIndex: 20,
  },
});

const Wrapper = styled(Card, {
  base: {
    pos: "relative",
    py: 2,
  },
});

export interface UserCardProps {
  children?: ReactNode;
  isRerun?: boolean;
  isLive?: boolean;
  user: HelixUser;

  onNewCollection?(): void;
}

function UserCard(props: UserCardProps) {
  const { user } = props;

  const defaultAction = useClickAction(user.login);

  return (
    <Anchor to={defaultAction}>
      <Wrapper
        className="group"
        title={<ChannelName login={user.login} name={user.displayName} />}
        subtitle={
          <Tooltip content={user.description}>
            <span>{user.description || <i>{t("detailText_noDescription")}</i>}</span>
          </Tooltip>
        }
        leftOrnament={
          <Thumbnail type={props.isRerun ? "rerun" : props.isLive ? "live" : undefined}>
            <Image src={user.profileImageUrl} ratio={1} />
          </Thumbnail>
        }
      >
        {props.children}

        <UserDropdown user={user} onNewCollection={props.onNewCollection}>
          <StyledDropdownButton />
        </UserDropdown>
      </Wrapper>
    </Anchor>
  );
}

export default UserCard;
