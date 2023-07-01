import { ReactElement, useMemo } from "react";

import { openUrl, t } from "~/common/helpers";
import { HelixChannelSearchResult } from "~/common/types";

import { useSettings } from "~/browser/hooks";

import DropdownMenu, { DropdownMenuItemProps } from "../DropdownMenu";

export interface ChannelDropdownProps {
  channel: HelixChannelSearchResult;
  children: ReactElement;
}

function ChannelDropdown(props: ChannelDropdownProps) {
  const { channel } = props;

  const [settings] = useSettings();

  const items = useMemo(() => {
    return new Array<DropdownMenuItemProps>(
      {
        type: "normal",
        title: t("optionValue_openChannel"),
        onClick(event) {
          openUrl(`https://twitch.tv/${channel.broadcasterLogin}`, event);
        },
      },
      {
        type: "normal",
        title: t("optionValue_openChat"),
        onClick(event) {
          openUrl(`https://twitch.tv/${channel.broadcasterLogin}/chat`, event);
        },
      },
      {
        type: "normal",
        title: t("optionValue_popout"),
        onClick(event) {
          openUrl(`https://twitch.tv/${channel.broadcasterLogin}/popout`, event);
        },
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
      }
    );
  }, [props, channel]);

  return <DropdownMenu items={items}>{props.children}</DropdownMenu>;
}

export default ChannelDropdown;
