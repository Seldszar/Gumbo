import { IconCheck, IconChevronRight } from "@tabler/icons-react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { ReactElement, MouseEventHandler, ReactNode } from "react";

import { sva } from "../styled-system/css";

const styles = sva({
  slots: ["content", "item", "itemIcon", "itemTitle", "separator"],
  base: {
    content: {
      bg: { base: "white", _dark: "neutral.800" },
      borderColor: { base: "neutral.300", _dark: "neutral.700" },
      borderWidth: "1px",
      minW: 52,
      overflow: "auto",
      p: 1,
      rounded: "sm",
      shadow: "lg",

      _focus: {
        outline: "none",
      },
    },

    item: {
      alignItems: "center",
      cursor: "pointer",
      display: "flex",
      fontWeight: "medium",
      gap: 3,
      h: 10,
      px: 3,
      rounded: "sm",
      textAlign: "left",
      w: "full",

      _focus: {
        bg: { base: "neutral.200", _dark: "neutral.700" },
        outline: "none",
      },

      _disabled: {
        opacity: 0.25,
      },
    },

    itemIcon: {
      flex: "none",
      w: 5,
    },

    itemTitle: {
      flex: 1,
      truncate: true,
    },

    separator: {
      bg: { base: "neutral.300", _dark: "neutral.700" },
      h: "1px",
      my: 1,
    },
  },
});

export interface CheckboxItemProps {
  type: "checkbox";

  icon?: ReactNode;
  disabled?: boolean;
  checked: boolean;
  title: string;

  onChange?(checked: boolean): void;
}

export interface NormalItemProps {
  type: "normal";

  icon?: ReactNode;
  disabled?: boolean;
  title: string;

  onClick?: MouseEventHandler;
}

export interface SubmenuItemProps {
  type: "menu";

  icon?: ReactNode;
  disabled?: boolean;
  title: string;

  items: DropdownMenuItemProps[];
}

export interface SeparatorItemProps {
  type: "separator";
}

export type DropdownMenuItemProps =
  | CheckboxItemProps
  | NormalItemProps
  | SeparatorItemProps
  | SubmenuItemProps;

function ItemRenderer(props: DropdownMenuItemProps) {
  const classes = styles();

  switch (props.type) {
    case "checkbox":
      return (
        <DropdownMenuPrimitive.CheckboxItem
          checked={props.checked}
          onCheckedChange={props.onChange}
        >
          <DropdownMenuPrimitive.ItemIndicator className={classes.itemIcon}>
            <IconCheck />
          </DropdownMenuPrimitive.ItemIndicator>
          <div className={classes.itemTitle}>{props.title}</div>
          <div className={classes.itemIcon} />
        </DropdownMenuPrimitive.CheckboxItem>
      );

    case "menu":
      return (
        <DropdownMenuPrimitive.Sub>
          <DropdownMenuPrimitive.SubTrigger className={classes.item}>
            <div className={classes.itemIcon}>{props.icon}</div>
            <div className={classes.itemTitle}>{props.title}</div>
            <div className={classes.itemIcon}>
              <IconChevronRight />
            </div>
          </DropdownMenuPrimitive.SubTrigger>
          <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.SubContent className={classes.content}>
              {props.items.map((props, index) => (
                <ItemRenderer key={index} {...props} />
              ))}
            </DropdownMenuPrimitive.SubContent>
          </DropdownMenuPrimitive.Portal>
        </DropdownMenuPrimitive.Sub>
      );

    case "separator":
      return <DropdownMenuPrimitive.Separator className={classes.separator} />;
  }

  return (
    <DropdownMenuPrimitive.Item className={classes.item} onClick={props.onClick}>
      <div className={classes.itemIcon}>{props.icon}</div>
      <div className={classes.itemTitle}>{props.title}</div>
      <div className={classes.itemIcon} />
    </DropdownMenuPrimitive.Item>
  );
}

export interface DropdownMenuProps {
  children: ReactElement;

  fullWidth?: boolean;
  placement?: string;

  items: DropdownMenuItemProps[];
}

function DropdownMenu(props: DropdownMenuProps) {
  const classes = styles();

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>{props.children}</DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          className={classes.content}
          onClick={(event) => event.stopPropagation()}
        >
          {props.items.map((props, index) => (
            <ItemRenderer key={index} {...props} />
          ))}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}

export default DropdownMenu;
