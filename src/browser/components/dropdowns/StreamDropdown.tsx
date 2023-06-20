import { IconPlus } from "@tabler/icons-react";
import { ReactElement, useMemo } from "react";

import { openUrl, t } from "~/common/helpers";
import { FollowedStream, HelixStream } from "~/common/types";

import { useCollections } from "~/browser/hooks";

import DropdownMenu, { DropdownMenuItemProps } from "../DropdownMenu";

export interface StreamDropdownProps {
  stream: FollowedStream | HelixStream;
  children: ReactElement;

  onNewCollection?(): void;
}

function StreamDropdown(props: StreamDropdownProps) {
  const { stream } = props;

  const [collections, { toggleCollectionItem }] = useCollections();

  const items = useMemo(() => {
    const result = new Array<DropdownMenuItemProps>(
      {
        type: "normal",
        title: t("optionValue_openChannel"),
        onClick(event) {
          openUrl(`https://twitch.tv/${stream.userLogin}`, event);
        },
      },
      {
        type: "normal",
        title: t("optionValue_openChat"),
        onClick(event) {
          openUrl(`https://twitch.tv/${stream.userLogin}/chat`, event);
        },
      },
      {
        type: "normal",
        title: t("optionValue_popout"),
        onClick(event) {
          openUrl(`https://twitch.tv/${stream.userLogin}/popout`, event);
        },
      },
      {
        type: "separator",
      }
    );

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
            checked: collection.items.includes(stream.userId),
            onChange: () => toggleCollectionItem(collection.id, stream.userId),
          })),
          {
            type: "separator",
          }
        );
      }

      result.push(
        {
          type: "menu",
          title: "Collections",
          items,
        },
        {
          type: "separator",
        }
      );
    }

    result.push(
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
      }
    );

    return result;
  }, [collections, props, stream]);

  return <DropdownMenu items={items}>{props.children}</DropdownMenu>;
}

export default StreamDropdown;
