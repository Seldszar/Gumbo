import { IconPencil, IconSettings, IconTrash } from "@tabler/icons-react";
import { reject } from "lodash-es";
import { Fragment, ReactNode, useMemo, useState } from "react";

import { t } from "~/common/helpers";
import { Collection, CollectionType } from "~/common/types";

import { useCollections } from "~/browser/hooks";
import { styled } from "~/browser/styled-system/jsx";

import Accordion from "./Accordion";
import DropdownMenu from "./DropdownMenu";

import CollectionModal from "./modals/CollectionModal";
import DeleteModal from "./modals/DeleteModal";

const StyledIconSettings = styled(IconSettings, {
  base: {
    cursor: "pointer",

    _hover: {
      color: { base: "black", _dark: "white" },
    },
  },
});

const Divider = styled("div", {
  base: {
    borderTopWidth: 1,
    borderColor: { base: "neutral.200", _dark: "neutral.800" },
    mx: 4,
  },
});

const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDir: "column",
    gap: 2,
    py: 2,
  },
});

interface ModalState {
  type: "delete" | "mutate";

  collection?: Collection;
  items?: string[];
}

interface Chunk<T> {
  collection?: Collection;
  items: T[];
}

interface RenderProps<T> extends Chunk<T> {
  createCollection(items?: string[]): void;
}

interface CollectionListProps<T> {
  className?: string;

  type: CollectionType;
  items: T[];

  defaultItems?: T[];

  getItemIdentifier(item: T): string;
  render(props: RenderProps<T>, index: number): ReactNode;
}

function CollectionList<T extends object>(props: CollectionListProps<T>) {
  const [collections, { addCollection, removeCollection, updateCollection }] = useCollections(
    props.type,
  );

  const [modalState, setModalState] = useState<ModalState | null>(null);

  const chunks = useMemo(() => {
    const result = new Array<Chunk<T>>();
    const known = new WeakSet<T>();

    collections
      .filter((collection) => collection.type === props.type)
      .forEach((collection) => {
        const items = props.items.filter((item) =>
          collection.items.includes(props.getItemIdentifier(item)),
        );

        if (items.length > 0) {
          items.forEach((item) => {
            known.add(item);
          });

          result.push({ collection, items });
        }
      });

    const items = (props.defaultItems ?? []).concat(reject(props.items, (item) => known.has(item)));

    if (items.length > 0) {
      result.push({ items });
    }

    return result.sort((a, b) => {
      if (a.collection == null) {
        return 1;
      }

      if (b.collection == null) {
        return -1;
      }

      return a.collection.name.localeCompare(b.collection.name);
    });
  }, [collections, props.items]);

  const createCollection = (items?: string[]) => {
    setModalState({ items, type: "mutate" });
  };

  return (
    <Wrapper className={props.className}>
      {chunks.map((chunk, index) => {
        const { collection } = chunk;

        if (collection) {
          return (
            <Accordion
              key={collection.id}
              title={collection.name}
              aside={
                <DropdownMenu
                  items={[
                    {
                      type: "normal",
                      title: t("optionValue_update"),
                      icon: <IconPencil size="1.25rem" />,
                      onClick: () => setModalState({ collection, type: "mutate" }),
                    },
                    {
                      type: "normal",
                      title: t("optionValue_delete"),
                      icon: <IconTrash size="1.25rem" />,
                      onClick: () => setModalState({ collection, type: "delete" }),
                    },
                  ]}
                >
                  <StyledIconSettings size="1rem" />
                </DropdownMenu>
              }
            >
              {props.render({ ...chunk, createCollection }, index)}
            </Accordion>
          );
        }

        return (
          <Fragment key="default">
            {index > 0 && <Divider />}

            <div>{props.render({ ...chunk, createCollection }, index)}</div>
          </Fragment>
        );
      })}

      {modalState && (
        <>
          {modalState.type === "delete" ? (
            <DeleteModal
              name={modalState.collection?.name}
              onCancel={() => setModalState(null)}
              onConfirm={() => {
                setModalState(null);

                if (modalState.collection) {
                  removeCollection(modalState.collection.id);
                }
              }}
            />
          ) : (
            <CollectionModal
              collection={modalState.collection}
              onCancel={() => setModalState(null)}
              onSubmit={(name) => {
                setModalState(null);

                if (modalState.collection) {
                  updateCollection(modalState.collection.id, {
                    name,
                  });

                  return;
                }

                addCollection({
                  items: modalState.items ?? [],
                  type: props.type,
                  name,
                });
              }}
            />
          )}
        </>
      )}
    </Wrapper>
  );
}

export default CollectionList;
