import { ReactElement, useMemo } from "react";

import { openUrl, t } from "~/common/helpers";
import { HelixCategorySearchResult, HelixGame } from "~/common/types";

import DropdownMenu, { DropdownMenuItemProps } from "../DropdownMenu";

export interface CategoryDropdownProps {
  category: HelixGame | HelixCategorySearchResult;
  children: ReactElement;
}

function CategoryDropdown(props: CategoryDropdownProps) {
  const { category } = props;

  const items = useMemo(() => {
    const igdbId = "igdbId" in category ? category.igdbId : "";

    return new Array<DropdownMenuItemProps>({
      type: "normal",
      disabled: !igdbId,
      title: t("buttonText_viewOn", "IGDB"),
      onClick: (event) => openUrl(`https://igdb.com/g/${parseInt(igdbId).toString(36)}`, event),
    });
  }, [category]);

  return <DropdownMenu items={items}>{props.children}</DropdownMenu>;
}

export default CategoryDropdown;
