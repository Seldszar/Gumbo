import { ReactElement, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { openUrl, t } from "~/common/helpers";
import { HelixChannelSearchResult } from "~/common/types";

import DropdownMenu, { DropdownMenuItemProps } from "../DropdownMenu";

export interface ChannelDropdownProps {
  channel: HelixChannelSearchResult;
  children: ReactElement;
}

function ChannelDropdown(props: ChannelDropdownProps) {
  const { channel } = props;

  const navigate = useNavigate();

  const items = useMemo(() => {
    return new Array<DropdownMenuItemProps>(
      {
        type: "normal",
        title: t("optionValue_openChannel"),
        onClick: (event) => openUrl(`https://twitch.tv/${channel.broadcasterLogin}`, event),
      },
      {
        type: "normal",
        title: t("optionValue_openChat"),
        onClick: (event) => openUrl(`https://twitch.tv/${channel.broadcasterLogin}/chat`, event),
      },
      {
        type: "normal",
        title: t("optionValue_popout"),
        onClick: (event) => openUrl(`https://twitch.tv/${channel.broadcasterLogin}/popout`, event),
      },
      {
        type: "separator",
      },
      {
        type: "normal",
        title: t("optionValue_about"),
        onClick: (event) => openUrl(`https://twitch.tv/${channel.broadcasterLogin}/about`, event),
      },
      {
        type: "normal",
        title: t("optionValue_schedule"),
        onClick: (event) =>
          openUrl(`https://twitch.tv/${channel.broadcasterLogin}/schedule`, event),
      },
      {
        type: "normal",
        title: t("optionValue_videos"),
        onClick: (event) => openUrl(`https://twitch.tv/${channel.broadcasterLogin}/videos`, event),
      },
      {
        type: "separator",
      },
      {
        type: "normal",
        disabled: !channel.gameId,
        title: t("optionValue_gotoCategory"),
        onClick: () => navigate(`/categories/${channel.gameId}`),
      }
    );
  }, [props, channel]);

  return <DropdownMenu items={items}>{props.children}</DropdownMenu>;
}

export default ChannelDropdown;
