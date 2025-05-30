import { DndContext, DragOverlay, UniqueIdentifier, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FloatingPortal } from "@floating-ui/react";
import { IconEdit, IconGripVertical, IconList, IconPlus, IconTrash } from "@tabler/icons-react";
import { concat, set, without } from "es-toolkit/compat";
import { HTMLAttributes, Key, ReactNode, forwardRef, useEffect, useState } from "react";

import { t } from "~/common/helpers";

import { styled } from "~/browser/styled-system/jsx";

import Button from "./Button";
import Modal from "./Modal";
import Panel from "./Panel";

import DeleteModal from "./modals/DeleteModal";

const List = styled("div", {
  base: {
    display: "flex",
    flexDir: "column",
    gap: "1px",
    mb: 2,
  },
});

const Item = styled("div", {
  base: {
    alignItems: "center",
    bg: { base: "neutral.200", _dark: "neutral.800" },
    display: "flex",
    gap: 4,
    pos: "relative",
    px: 4,
    py: 3,
    rounded: "sm",
  },

  variants: {
    dragOverlay: {
      true: {
        bg: { base: "neutral.300", _dark: "neutral.700" },
        cursor: "grabbing",
        shadow: "lg",

        "& .handle": {
          cursor: "grabbing",
        },
      },
    },
  },
});

const ItemTitle = styled("div", {
  base: {
    flex: 1,
  },
});

const ItemHandle = styled("button", {
  base: {
    color: "neutral.500",
    cursor: "grab",
    flex: "none",
  },
});

const ItemButton = styled("button", {
  base: {
    flex: "none",
  },
});

const Empty = styled("div", {
  base: {
    alignItems: "center",
    bg: { base: "black/5", _dark: "black/25" },
    borderColor: { base: "neutral.300", _dark: "neutral.800" },
    borderWidth: 1,
    display: "flex",
    flexDir: "column",
    py: 12,
    rounded: "sm",
  },
});

const EmptyMessage = styled("div", {
  base: {
    fontSize: "xl",
    mb: 6,
    textAlign: "center",
  },
});

export type ItemType = UniqueIdentifier | { id: UniqueIdentifier };

interface ListItemProps extends HTMLAttributes<HTMLDivElement> {
  handleProps?: HTMLAttributes<HTMLButtonElement>;
  dragOverlay?: boolean;
}

const ListItem = forwardRef<HTMLDivElement, ListItemProps>((props, ref) => {
  const { children, handleProps, ...rest } = props;

  return (
    <Item ref={ref} {...rest}>
      <ItemHandle {...handleProps} className="handle">
        <IconGripVertical size="1.25rem" />
      </ItemHandle>

      {children}
    </Item>
  );
});

interface SortableListItemProps {
  id: UniqueIdentifier;

  children: ReactNode;
}

function SortableListItem(props: SortableListItemProps) {
  const { isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: props.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : undefined,
    transition,
  };

  return (
    <ListItem ref={setNodeRef} style={style} handleProps={listeners}>
      {props.children}
    </ListItem>
  );
}

interface ModalState<T> {
  type: "delete" | "mutate";

  index: number;
  item?: T;
}

interface ModalProps<T> {
  value?: T;

  onSubmit(value: T): void;
  onCancel(): void;
}

const getKey = (item: ItemType) => (typeof item === "object" ? item.id : item);

export interface ListManagerProps<T extends ItemType> {
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  value: T[];

  onChange(value: T[]): void;
  renderTitle(value: T): string;
  renderForm(props: ModalProps<T>): ReactNode;
  getKey(value: T): Key;
}

function ListManager<T extends ItemType>(props: ListManagerProps<T>) {
  const [items, setItems] = useState(props.value);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [modalState, setModalState] = useState<ModalState<T> | null>(null);

  useEffect(() => setItems(props.value), [props.value]);

  const getItem = (id: UniqueIdentifier) => items.find((item) => getKey(item) === id);
  const getIndex = (id: UniqueIdentifier) => items.findIndex((item) => getKey(item) === id);

  const activeItem = activeId ? getItem(activeId) : undefined;

  return (
    <fieldset className={props.className} disabled={props.disabled}>
      {items.length > 0 ? (
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={({ active }) => {
            if (active == null) {
              return;
            }

            setActiveId(active.id);
          }}
          onDragEnd={({ active, over }) => {
            setActiveId(null);

            if (over == null) {
              return;
            }

            setItems((items) => {
              const oldIndex = getIndex(active.id);
              const newIndex = getIndex(over.id);

              if (oldIndex !== newIndex) {
                props.onChange((items = arrayMove(items, oldIndex, newIndex)));
              }

              return items;
            });
          }}
        >
          <SortableContext items={items}>
            <List>
              {items.map((item, index) => (
                <SortableListItem key={getKey(item)} id={getKey(item)}>
                  <ItemTitle>{props.renderTitle(item)}</ItemTitle>
                  <ItemButton onClick={() => setModalState({ index, item, type: "mutate" })}>
                    <IconEdit size="1.25rem" />
                  </ItemButton>
                  <ItemButton onClick={() => setModalState({ index, item, type: "delete" })}>
                    <IconTrash size="1.25rem" />
                  </ItemButton>
                </SortableListItem>
              ))}
            </List>
          </SortableContext>

          <Button
            fullWidth
            color="purple"
            icon={<IconPlus size="1.25rem" />}
            onClick={() => setModalState({ index: -1, type: "mutate" })}
          >
            {t("buttonText_add")}
          </Button>

          <FloatingPortal id="modal-root">
            <DragOverlay>
              {activeItem && (
                <ListItem dragOverlay>
                  <ItemTitle>{props.renderTitle(activeItem)}</ItemTitle>
                </ListItem>
              )}
            </DragOverlay>
          </FloatingPortal>
        </DndContext>
      ) : (
        <Empty>
          <IconList size="1.75rem" />
          <EmptyMessage>{t("errorText_emptyList")}</EmptyMessage>
          <Button
            color="purple"
            icon={<IconPlus size="1.25rem" />}
            onClick={() => setModalState({ index: -1, type: "mutate" })}
          >
            {t("buttonText_add")}
          </Button>
        </Empty>
      )}

      {modalState && (
        <>
          {modalState.type === "delete" ? (
            <DeleteModal
              name={modalState.item && props.renderTitle(modalState.item)}
              onCancel={() => setModalState(null)}
              onConfirm={() => {
                setModalState(null);

                if (modalState.item) {
                  props.onChange(without(items, modalState.item));
                }
              }}
            />
          ) : (
            <Modal>
              <Panel
                title={t(modalState.item ? "titleText_updateItem" : "titleText_createItem")}
                onClose={() => setModalState(null)}
              >
                {props.renderForm({
                  value: modalState.item,
                  onSubmit(item) {
                    setModalState(null);

                    switch (modalState.index) {
                      case -1:
                        return props.onChange(concat(items, item));

                      default:
                        return props.onChange(set(items, modalState.index, item));
                    }
                  },
                  onCancel() {
                    setModalState(null);
                  },
                })}
              </Panel>
            </Modal>
          )}
        </>
      )}
    </fieldset>
  );
}

export default ListManager;
