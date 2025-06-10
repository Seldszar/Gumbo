import { IconPlus } from "@tabler/icons-react";
import { ReactElement, useMemo } from "react";
import { useNavigate } from "react-router";

import { openUrl, t, template } from "~/common/helpers";
import { HelixStream } from "~/common/types";

import { useCollections, useMutedUsers, useSettings } from "~/browser/hooks";

import DropdownMenu, { DropdownMenuItemProps } from "../DropdownMenu";

export interface StreamDropdownProps {
  children: ReactElement;
  stream: HelixStream;

  onNewCollection?(): void;
}

function StreamDropdown(props: StreamDropdownProps) {
  const { stream } = props;

  const navigate = useNavigate();

  const [settings] = useSettings();
  const [collections, { toggleCollectionItem }] = useCollections("user");
  const [mutedUsers, { toggle }] = useMutedUsers();

  const {
    dropdownMenu: { customActions },
  } = settings;

  const items = useMemo(() => {
    const result = new Array<DropdownMenuItemProps>(
      {
        type: "checkbox",
        title: t("optionValue_muteChannel"),
        checked: mutedUsers.includes(stream.userId),
        onChange: () => toggle(stream.userId),
      },
      {
        type: "normal",
        title: t("optionValue_openChannel"),
        onClick: (event) => openUrl(`https://twitch.tv/${stream.userLogin}`, event),
      },
      {
        type: "normal",
        title: t("optionValue_openChat"),
        onClick: (event) => openUrl(`https://twitch.tv/${stream.userLogin}/chat`, event),
      },
      {
        type: "normal",
        title: t("optionValue_popout"),
        onClick: (event) => openUrl(`https://twitch.tv/${stream.userLogin}/popout`, event),
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
                "{login}": stream.userLogin,
                "{id}": stream.userId,
              }),
              event,
            ),
        })),
      });
    }

    if (props.onNewCollection) {
      const userCollections = collections.filter((collection) => collection.type === "user");

      const items = new Array<DropdownMenuItemProps>({
        type: "normal",
        title: t("optionValue_newCollection"),
        icon: <IconPlus size="1.25rem" />,
        onClick: props.onNewCollection,
      });

      if (userCollections.length > 0) {
        items.unshift(
          ...userCollections.map<DropdownMenuItemProps>((collection) => ({
            type: "checkbox",
            title: collection.name,
            checked: collection.items.includes(stream.userId),
            onChange: () => toggleCollectionItem(collection.id, stream.userId),
          })),
          {
            type: "separator",
          },
        );
      }

      result.push(
        {
          type: "separator",
        },
        {
          type: "menu",
          title: t("optionValue_collections"),
          items,
        },
      );
    }

    result.push(
      {
        type: "separator",
      },
      {
        type: "normal",
        title: t("optionValue_about"),
        onClick: (event) => openUrl(`https://twitch.tv/${stream.userLogin}/about`, event),
      },
      {
        type: "normal",
        title: t("optionValue_schedule"),
        onClick: (event) => openUrl(`https://twitch.tv/${stream.userLogin}/schedule`, event),
      },
      {
        type: "normal",
        title: t("optionValue_videos"),
        onClick: (event) => openUrl(`https://twitch.tv/${stream.userLogin}/videos`, event),
      },
      {
        type: "separator",
      },
      {
        type: "normal",
        disabled: !stream.gameId,
        title: t("optionValue_gotoCategory"),
        onClick: () => navigate(`/categories/${stream.gameId}`),
      },
    );

    return result;
  }, [collections, customActions, props.onNewCollection, stream]);

  return <DropdownMenu items={items}>{props.children}</DropdownMenu>;
}

export default StreamDropdown;
