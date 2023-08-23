import { ReactElement, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { openUrl, t, template } from "~/common/helpers";
import { HelixChannelSearchResult } from "~/common/types";

import { useSettings } from "~/browser/hooks";

import DropdownMenu, { DropdownMenuItemProps } from "../DropdownMenu";

export interface ChannelDropdownProps {
  channel: HelixChannelSearchResult;
  children: ReactElement;
}

function ChannelDropdown(props: ChannelDropdownProps) {
  const { channel } = props;

  const navigate = useNavigate();

  const [settings] = useSettings();

  const {
    dropdownMenu: { customActions },
  } = settings;

  const items = useMemo(() => {
    const result = new Array<DropdownMenuItemProps>(
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
    );

    if (customActions.length > 0) {
      result.push({
        type: "menu",
        title: t("optionValue_customActions"),
        items: customActions.map<DropdownMenuItemProps>((item) => ({
          type: "normal",
          title: item.title,
          onClick: (event) =>
            openUrl(
              template(item.url, {
                "{login}": channel.broadcasterLogin,
                "{id}": channel.id,
              }),
              event,
            ),
        })),
      });
    }

    result.push(
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
      },
    );

    return result;
  }, [channel, customActions]);

  return <DropdownMenu items={items}>{props.children}</DropdownMenu>;
}

export default ChannelDropdown;
