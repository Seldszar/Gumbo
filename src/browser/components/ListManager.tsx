import { DndContext, DragOverlay, UniqueIdentifier, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FloatingPortal } from "@floating-ui/react";
import { IconEdit, IconGripVertical, IconTrash } from "@tabler/icons-react";
import { concat, pullAt, set } from "lodash-es";
import { HTMLAttributes, Key, ReactNode, forwardRef, useEffect, useState } from "react";
import tw, { css, styled } from "twin.macro";

import { t } from "~/common/helpers";

import Button from "./Button";
import Modal from "./Modal";
import Panel from "./Panel";

import DeleteModal from "./modals/DeleteModal";

const AddButton = styled(Button)`
  ${tw`mt-2`}
`;

const List = styled.div`
  ${tw`flex flex-col gap-px`}
`;

interface ItemProps {
  dragOverlay?: boolean;
}

const Item = styled.div<ItemProps>`
  ${tw`bg-neutral-200 dark:bg-neutral-800 flex items-center gap-4 px-4 py-3 relative rounded`}

  ${(props) =>
    props.dragOverlay &&
    css`
      ${tw`shadow-lg bg-neutral-300 dark:bg-neutral-700`}

      &, ${ItemHandle} {
        ${tw`cursor-grabbing`}
      }
    `}
`;

const ItemTitle = styled.div`
  ${tw`flex-1`}
`;

const ItemHandle = styled.button`
  ${tw`cursor-grab flex-none text-neutral-500`}
`;

const ItemButton = styled.button`
  ${tw`flex-none`}
`;

const EmptyMessage = styled.div`
  ${tw`bg-black/10 py-5 rounded text-center text-neutral-500 dark:bg-black/25`}
`;

export type ItemType = UniqueIdentifier | { id: UniqueIdentifier };

interface ListItemProps extends HTMLAttributes<HTMLDivElement> {
  handleProps?: HTMLAttributes<HTMLButtonElement>;
  dragOverlay?: boolean;
}

const ListItem = forwardRef<HTMLDivElement, ListItemProps>((props, ref) => {
  const { children, handleProps, ...rest } = props;

  return (
    <Item ref={ref} {...rest}>
      <ItemHandle {...handleProps}>
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
  emptyMessage?: string;
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
        <EmptyMessage>{props.emptyMessage}</EmptyMessage>
      )}

      <AddButton
        fullWidth
        color="purple"
        onClick={() => setModalState({ index: -1, type: "mutate" })}
      >
        {t("buttonText_add")}
      </AddButton>

      {modalState && (
        <>
          {modalState.type === "delete" ? (
            <DeleteModal
              name={modalState.item && props.renderTitle(modalState.item)}
              onCancel={() => setModalState(null)}
              onConfirm={() => {
                setModalState(null);

                if (modalState.index > -1) {
                  props.onChange(pullAt(items, modalState.index));
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
