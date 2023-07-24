import { IconPlus } from "@tabler/icons-react";
import { ReactElement, useMemo } from "react";

import { openUrl, t, template } from "~/common/helpers";
import { HelixUser } from "~/common/types";

import { useCollections, useSettings } from "~/browser/hooks";

import DropdownMenu, { DropdownMenuItemProps } from "../DropdownMenu";

export interface UserDropdownProps {
  children: ReactElement;
  user: HelixUser;

  onNewCollection?(): void;
}

function UserDropdown(props: UserDropdownProps) {
  const { user } = props;

  const [settings] = useSettings();
  const [collections, { toggleCollectionItem }] = useCollections("user");

  const {
    dropdownMenu: { customActions },
  } = settings;

  const items = useMemo(() => {
    const result = new Array<DropdownMenuItemProps>(
      {
        type: "normal",
        title: t("optionValue_openChannel"),
        onClick: (event) => openUrl(`https://twitch.tv/${user.login}`, event),
      },
      {
        type: "normal",
        title: t("optionValue_openChat"),
        onClick: (event) => openUrl(`https://twitch.tv/${user.login}/chat`, event),
      },
      {
        type: "normal",
        title: t("optionValue_popout"),
        onClick: (event) => openUrl(`https://twitch.tv/${user.login}/popout`, event),
      }
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
                "{login}": user.login,
                "{id}": user.id,
              }),
              event
            ),
        })),
      });
    }

    if (props.onNewCollection) {
      const userCollections = collections.filter((collection) => collection.type === "user");

      const items = new Array<DropdownMenuItemProps>({
        type: "normal",
        title: "New collection",
        icon: <IconPlus size="1.25rem" />,
        onClick: props.onNewCollection,
      });

      if (userCollections.length > 0) {
        items.unshift(
          ...userCollections.map<DropdownMenuItemProps>((collection) => ({
            type: "checkbox",
            title: collection.name,
            checked: collection.items.includes(user.id),
            onChange: () => toggleCollectionItem(collection.id, user.id),
          })),
          {
            type: "separator",
          }
        );
      }

      result.push(
        {
          type: "separator",
        },
        {
          type: "menu",
          title: "Collections",
          items,
        }
      );
    }

    result.push(
      {
        type: "separator",
      },
      {
        type: "normal",
        title: t("optionValue_about"),
        onClick: (event) => openUrl(`https://twitch.tv/${user.login}/about`, event),
      },
      {
        type: "normal",
        title: t("optionValue_schedule"),
        onClick: (event) => openUrl(`https://twitch.tv/${user.login}/schedule`, event),
      },
      {
        type: "normal",
        title: t("optionValue_videos"),
        onClick: (event) => openUrl(`https://twitch.tv/${user.login}/videos`, event),
      }
    );

    return result;
  }, [collections, customActions, props.onNewCollection, user]);

  return <DropdownMenu items={items}>{props.children}</DropdownMenu>;
}

export default UserDropdown;
