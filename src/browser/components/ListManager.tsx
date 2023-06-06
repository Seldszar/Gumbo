import { IconEdit, IconGripVertical, IconTrash } from "@tabler/icons-react";
import { AnimatePresence, Reorder, useDragControls } from "framer-motion";
import { concat, set, without } from "lodash-es";
import { Key, ReactNode, useState } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import Button from "./Button";
import Modal from "./Modal";
import Panel from "./Panel";

const AddButton = styled(Button)`
  ${tw`mt-2`}
`;

const List = styled(Reorder.Group)`
  ${tw`flex flex-col gap-px`}
`;

interface ItemProps {
  isDragging?: boolean;
}

const Item = styled(Reorder.Item)<ItemProps>`
  ${tw`bg-neutral-200 dark:bg-neutral-800 flex items-center gap-4 px-4 py-3 relative rounded`}

  ${(props) =>
    props.isDragging &&
    tw`shadow-lg bg-neutral-300 dark:bg-neutral-700 after:(absolute content-[''] cursor-grabbing inset-0)`}
`;

const ItemTitle = styled.div`
  ${tw`flex-1`}
`;

const DragIcon = styled.button`
  ${tw`cursor-grab flex-none text-neutral-500`}
`;

const ItemButton = styled.button`
  ${tw`flex-none`}
`;

const EmptyMessage = styled.div`
  ${tw`bg-black/10 py-5 rounded text-center text-neutral-500 dark:bg-black/25`}
`;

interface ListItemProps<T> {
  children: ReactNode;
  value: T;
}

function ListItem<T>(props: ListItemProps<T>) {
  const [isDragging, setDragging] = useState(false);

  const controls = useDragControls();

  return (
    <Item
      value={props.value}
      dragListener={false}
      dragControls={controls}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
      isDragging={isDragging}
    >
      <DragIcon onPointerDown={(event) => controls.start(event)}>
        <IconGripVertical size="1.25rem" />
      </DragIcon>

      {props.children}
    </Item>
  );
}

interface ModalState<T> {
  index: number;
  item?: T;
}

interface ModalProps<T> {
  value?: T;

  onSubmit(value: T): void;
  onCancel(): void;
}

export interface ListManagerProps<T> {
  className?: string;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  value: T[];

  onChange(value: T[]): void;
  renderTitle(value: T): ReactNode;
  renderForm(props: ModalProps<T>): ReactNode;
  getKey(value: T): Key;
}

function ListManager<T>(props: ListManagerProps<T>) {
  const [modalState, setModalState] = useState<ModalState<T> | null>(null);

  return (
    <fieldset className={props.className} disabled={props.disabled}>
      {props.value.length > 0 ? (
        <List axis="y" values={props.value} onReorder={props.onChange}>
          {props.value.map((value, index) => (
            <ListItem key={props.getKey(value)} value={value}>
              <ItemTitle>{props.renderTitle(value)}</ItemTitle>
              <ItemButton onClick={() => setModalState({ index, item: value })}>
                <IconEdit size="1.25rem" />
              </ItemButton>
              <ItemButton onClick={() => props.onChange(without(props.value, value))}>
                <IconTrash size="1.25rem" />
              </ItemButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <EmptyMessage>{props.emptyMessage}</EmptyMessage>
      )}

      <AddButton color="purple" fullWidth onClick={() => setModalState({ index: -1 })}>
        {t("buttonText_add")}
      </AddButton>

      <AnimatePresence initial={false}>
        {modalState && (
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
                      return props.onChange(concat(props.value, item));

                    default:
                      return props.onChange(set(props.value, modalState.index, item));
                  }
                },
                onCancel() {
                  setModalState(null);
                },
              })}
            </Panel>
          </Modal>
        )}
      </AnimatePresence>
    </fieldset>
  );
}

export default ListManager;
