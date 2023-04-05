import { FC, HTMLAttributes, ReactNode, useMemo } from "react";
import tw, { styled } from "twin.macro";

const Separator = styled.li`
  ${tw`bg-black/10 dark:bg-white/10 h-px mx-2 my-1`}
`;

const Link = styled.li`
  ${tw`cursor-pointer flex font-medium gap-4 items-center px-4 py-2 hover:bg-black/10 dark:hover:bg-white/10`}
`;

const ItemIcon = styled.div`
  ${tw`flex-none opacity-50 w-5`}
`;

const ItemInner = styled.div`
  ${tw`flex-1 truncate`}
`;

export interface SeparatorProps {
  type: "separator";
}

export interface LinkProps extends HTMLAttributes<HTMLLIElement> {
  type: "link";
  icon?: ReactNode;
}

export type MenuItemProps = SeparatorProps | LinkProps;

export interface MenuProps {
  items: MenuItemProps[];
  className?: string;
}

const Menu: FC<MenuProps> = (props) => {
  const hasIcons = useMemo(() => props.items.some((item) => "icon" in item), [props.items]);

  return (
    <ul className={props.className}>
      {props.items.map((item, index) => {
        switch (item.type) {
          case "separator": {
            return <Separator key={index} />;
          }

          default: {
            const { children, icon, ...rest } = item;

            return (
              <Link {...rest} key={index}>
                {hasIcons && <ItemIcon>{icon}</ItemIcon>}
                <ItemInner>{children}</ItemInner>
              </Link>
            );
          }
        }
      })}
    </ul>
  );
};

export default Menu;
