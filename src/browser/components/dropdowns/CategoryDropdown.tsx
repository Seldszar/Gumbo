import { IconPlus } from "@tabler/icons-react";
import { ReactElement, useMemo } from "react";

import { openUrl, t } from "~/common/helpers";
import { HelixCategorySearchResult, HelixGame } from "~/common/types";

import { useCollections } from "~/browser/hooks";

import DropdownMenu, { DropdownMenuItemProps } from "../DropdownMenu";

export interface CategoryDropdownProps {
  category: HelixGame | HelixCategorySearchResult;
  children: ReactElement;

  onNewCollection?(): void;
}

function CategoryDropdown(props: CategoryDropdownProps) {
  const { category } = props;

  const [collections, { toggleCollectionItem }] = useCollections("category");

  const items = useMemo(() => {
    const igdbId = "igdbId" in category ? category.igdbId : "";

    const result = new Array<DropdownMenuItemProps>({
      type: "normal",
      disabled: !igdbId,
      title: t("buttonText_viewOn", "IGDB"),
      onClick: (event) => openUrl(`https://igdb.com/g/${parseInt(igdbId).toString(36)}`, event),
    });

    if (props.onNewCollection) {
      const items = new Array<DropdownMenuItemProps>({
        type: "normal",
        title: t("optionValue_newCollection"),
        icon: <IconPlus size="1.25rem" />,
        onClick: props.onNewCollection,
      });

      if (collections.length > 0) {
        items.unshift(
          ...collections.map<DropdownMenuItemProps>((collection) => ({
            type: "checkbox",
            title: collection.name,
            checked: collection.items.includes(category.id),
            onChange: () => toggleCollectionItem(collection.id, category.id),
          })),
          {
            type: "separator",
          }
        );
      }

      result.unshift(
        {
          type: "menu",
          title: t("optionValue_collections"),
          items,
        },
        {
          type: "separator",
        }
      );
    }

    return result;
  }, [category, props]);

  return <DropdownMenu items={items}>{props.children}</DropdownMenu>;
}

export default CategoryDropdown;
