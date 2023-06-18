import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  FloatingNode,
  FloatingPortal,
  FloatingTree,
  offset,
  Placement,
  safePolygon,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useFloatingTree,
  useHover,
  useInteractions,
  useListItem,
  useListNavigation,
  useMergeRefs,
  useTypeahead,
} from "@floating-ui/react";
import { IconChevronRight, IconSquare, IconSquareCheck } from "@tabler/icons-react";
import {
  useContext,
  HTMLProps,
  createContext,
  forwardRef,
  useRef,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  cloneElement,
  ReactElement,
  MouseEventHandler,
  ReactNode,
} from "react";
import tw, { styled } from "twin.macro";

import { remToPixels } from "../helpers";

const ItemIcon = styled.div`
  ${tw`flex-none w-5`}
`;

const ItemTitle = styled.div`
  ${tw`flex-1 truncate`}
`;

const Item = styled.button`
  ${tw`flex font-medium gap-3 h-10 items-center px-3 rounded text-left w-full focus:(bg-neutral-200 outline-none) dark:focus:bg-neutral-700 disabled:opacity-25`}
`;

const Separator = styled.div`
  ${tw`bg-neutral-300 dark:bg-neutral-700 h-px my-1`}
`;

const Wrapper = styled.div`
  ${tw`bg-white border border-neutral-300 p-1 overflow-auto rounded shadow-lg min-w-[theme('spacing.52')] focus:outline-none dark:(bg-neutral-800 border-neutral-700)`}
`;

type GetItemProps = (userProps?: HTMLProps<HTMLElement>) => Record<string, unknown>;

interface ContextProps {
  getItemProps: GetItemProps;
  setActiveIndex: Dispatch<SetStateAction<number | null>>;
  activeIndex: number | null;
  isOpen: boolean;
}

const MenuContext = createContext<ContextProps>({
  getItemProps: (userProps) => ({ ...userProps }),
  setActiveIndex: () => void 0,
  activeIndex: null,
  isOpen: false,
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
  closeOnClick?: boolean;
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

interface BaseItemProps extends HTMLProps<HTMLButtonElement> {
  leftOrnament?: ReactNode;
  rightOrnament?: ReactNode;
}

const BaseItem = forwardRef<HTMLButtonElement, BaseItemProps>((props, ref) => {
  const { leftOrnament, rightOrnament, title, ...rest } = props;

  const item = useListItem({
    label: props.disabled ? null : title,
  });

  const menu = useContext(MenuContext);

  return (
    <Item
      {...menu.getItemProps(rest)}
      ref={useMergeRefs([item.ref, ref])}
      tabIndex={item.index === menu.activeIndex ? 0 : -1}
    >
      <ItemIcon>{leftOrnament}</ItemIcon>
      <ItemTitle>{title}</ItemTitle>
      <ItemIcon>{rightOrnament}</ItemIcon>
    </Item>
  );
});

interface MenuCheckboxProps {
  icon?: ReactNode;
  disabled?: boolean;
  checked: boolean;
  title: string;

  onChange?(checked: boolean): void;
}

const MenuCheckbox = forwardRef<HTMLButtonElement, MenuCheckboxProps>((props, ref) => {
  return (
    <BaseItem
      ref={ref}
      title={props.title}
      disabled={props.disabled}
      leftOrnament={props.icon}
      rightOrnament={
        props.checked ? (
          <IconSquareCheck size="1.25rem" strokeWidth={1.75} />
        ) : (
          <IconSquare size="1.25rem" strokeWidth={1.75} />
        )
      }
      onClick={() => {
        props.onChange?.(!props.checked);
      }}
    />
  );
});

interface MenuItemProps {
  icon?: ReactNode;
  disabled?: boolean;
  title: string;

  onClick?: MouseEventHandler;
}

export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>((props, ref) => {
  const tree = useFloatingTree();

  return (
    <BaseItem
      ref={ref}
      title={props.title}
      disabled={props.disabled}
      leftOrnament={props.icon}
      onClick={(event) => {
        props.onClick?.(event);
        tree?.events.emit("close");
      }}
    />
  );
});

interface MenuOpenData {
  nodeId: string;
  parentId: string;
}

interface MenuProps extends HTMLProps<HTMLElement> {
  children: ReactElement;
  placement?: Placement;
  fullWidth?: boolean;

  items: DropdownMenuItemProps[];
}

const Menu = forwardRef<HTMLElement, MenuProps>((props, ref) => {
  const { children, items, placement, ...rest } = props;

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const elementsRef = useRef<Array<HTMLElement | null>>([]);
  const labelsRef = useRef<Array<string | null>>([]);

  const parent = useContext(MenuContext);

  const tree = useFloatingTree();
  const nodeId = useFloatingNodeId();
  const parentId = useFloatingParentNodeId();
  const item = useListItem();

  const isNested = typeof parentId === "string";

  const { floatingStyles, refs, context } = useFloating({
    nodeId,
    open: isOpen,
    strategy: "fixed",
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    placement: isNested ? "right-start" : placement ?? "bottom-start",
    middleware: [
      offset({
        alignmentAxis: remToPixels(isNested ? -0.25 : 0),
        mainAxis: remToPixels(isNested ? -0.5 : 0.5),
      }),
      flip(),
      shift({
        padding: remToPixels(0.5),
      }),
      size({
        padding: remToPixels(0.5),
        apply({ availableHeight, availableWidth, elements, rects }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${availableHeight}px`,
            maxWidth: `${availableWidth}px`,
          });

          if (props.fullWidth) {
            Object.assign(elements.floating.style, {
              width: `${rects.reference.width}px`,
            });
          }
        },
      }),
    ],
  });

  const hover = useHover(context, {
    enabled: isNested,
    delay: {
      open: 75,
    },
    handleClose: safePolygon({
      blockPointerEvents: true,
    }),
  });

  const click = useClick(context, {
    event: "mousedown",
    ignoreMouse: isNested,
    toggle: !isNested,
  });

  const dismiss = useDismiss(context, {
    bubbles: true,
  });

  const listNavigation = useListNavigation(context, {
    onNavigate: setActiveIndex,
    listRef: elementsRef,
    nested: isNested,
    activeIndex,
  });

  const typeahead = useTypeahead(context, {
    onMatch: isOpen ? setActiveIndex : undefined,
    listRef: labelsRef,
    activeIndex,
  });

  const { getFloatingProps, getItemProps, getReferenceProps } = useInteractions([
    hover,
    click,
    dismiss,
    listNavigation,
    typeahead,
  ]);

  useEffect(() => {
    if (tree == null) {
      return;
    }

    function onMenuClose() {
      setIsOpen(false);
    }

    function onMenuOpen(data: MenuOpenData) {
      if (data.nodeId === nodeId || data.parentId !== parentId) {
        return;
      }

      setIsOpen(false);
    }

    tree.events.on("close", onMenuClose);
    tree.events.on("open", onMenuOpen);

    return () => {
      tree.events.off("close", onMenuClose);
      tree.events.off("open", onMenuOpen);
    };
  }, [tree, nodeId, parentId]);

  useEffect(() => {
    if (isOpen) {
      tree?.events.emit("open", { parentId, nodeId });
    }
  }, [tree, isOpen, nodeId, parentId]);

  return (
    <FloatingNode id={nodeId}>
      {cloneElement(
        children,
        getReferenceProps(
          parent.getItemProps({
            ...rest,

            ref: useMergeRefs([refs.setReference, item.ref, ref, (children as any).ref]),
            tabIndex: isNested ? (parent.activeIndex === item.index ? 0 : -1) : undefined,

            onClick(event) {
              event.stopPropagation();
              event.preventDefault();
            },
          })
        )
      )}

      <MenuContext.Provider value={{ activeIndex, setActiveIndex, getItemProps, isOpen }}>
        <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
          {isOpen && (
            <FloatingPortal id="modal-root">
              <FloatingFocusManager
                initialFocus={isNested ? -1 : 0}
                returnFocus={!isNested}
                context={context}
                modal={false}
              >
                <Wrapper
                  {...getFloatingProps({
                    ref: refs.setFloating,
                    style: floatingStyles,

                    onClick(event) {
                      event.stopPropagation();
                      event.preventDefault();
                    },
                  })}
                >
                  {items.map((props, index) => {
                    switch (props.type) {
                      case "checkbox":
                        return <MenuCheckbox {...props} key={index} />;

                      case "menu":
                        return (
                          <Menu items={props.items} key={index}>
                            <BaseItem
                              title={props.title}
                              leftOrnament={props.icon}
                              rightOrnament={<IconChevronRight size="1.25rem" />}
                            />
                          </Menu>
                        );

                      case "separator":
                        return <Separator key={index} />;
                    }

                    return <MenuItem {...props} key={index} />;
                  })}
                </Wrapper>
              </FloatingFocusManager>
            </FloatingPortal>
          )}
        </FloatingList>
      </MenuContext.Provider>
    </FloatingNode>
  );
});

export interface DropdownMenuProps {
  children: ReactElement;
  placement?: Placement;
  fullWidth?: boolean;

  items: DropdownMenuItemProps[];
}

export const DropdownMenu = forwardRef<HTMLElement, DropdownMenuProps>((props, ref) => (
  <FloatingTree>
    <Menu ref={ref} {...props} />
  </FloatingTree>
));

export default DropdownMenu;
