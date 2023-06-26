import { ReactNode } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";
import { HelixUser } from "~/common/types";

import { useClickAction } from "~/browser/hooks";

import Anchor from "../Anchor";
import Card from "../Card";
import ChannelName from "../ChannelName";
import DropdownButton from "../DropdownButton";
import Image from "../Image";
import Tooltip from "../Tooltip";

import UserDropdown from "../dropdowns/UserDropdown";

const Thumbnail = styled.div`
  ${tw`bg-black overflow-hidden relative rounded-full w-12`}
`;

const StyledDropdownButton = styled(DropdownButton)`
  ${tw`absolute invisible end-2 -top-2 z-20`}
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

export interface UserCardProps {
  children?: ReactNode;
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
        isLive={props.isLive}
        title={<ChannelName login={user.login} name={user.displayName} />}
        subtitle={
          <Tooltip content={user.description}>
            <span>{user.description || <i>{t("detailText_noDescription")}</i>}</span>
          </Tooltip>
        }
        leftOrnament={
          <Thumbnail>
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
