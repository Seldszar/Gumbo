import { IconPencil, IconSettings, IconTrash } from "@tabler/icons-react";
import { reject } from "es-toolkit/compat";
import { Fragment, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";
import { Collection, CollectionType } from "~/common/types";

import { useCollections } from "~/browser/hooks";

import Accordion from "./Accordion";
import DropdownMenu from "./DropdownMenu";

import CollectionModal from "./modals/CollectionModal";
import DeleteModal from "./modals/DeleteModal";

const StyledAccordion = styled(Accordion)``;

const StyledIconSettings = styled(IconSettings)`
  ${tw`cursor-pointer hover:(text-black dark:text-white)`}
`;

const Divider = styled.div`
  ${tw`border-t border-neutral-200 dark:border-neutral-800 mx-4`}
`;

const DefaultCollection = styled.div``;

const Wrapper = styled.div`
  ${tw`flex flex-col gap-2 py-2`}
`;

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
  const getItemIdentifierRef = useRef(props.getItemIdentifier);

  const [collections, { addCollection, removeCollection, updateCollection }] = useCollections(
    props.type,
  );

  const [modalState, setModalState] = useState<ModalState | null>(null);

  useEffect(() => {
    getItemIdentifierRef.current = props.getItemIdentifier;
  });

  const chunks = useMemo(() => {
    const result = new Array<Chunk<T>>();
    const known = new WeakSet<T>();

    collections.forEach((collection) => {
      const items = props.items.filter((item) =>
        collection.items.includes(getItemIdentifierRef.current(item)),
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
  }, [collections, props.defaultItems, props.items]);

  const createCollection = (items?: string[]) => {
    setModalState({ items, type: "mutate" });
  };

  return (
    <Wrapper className={props.className}>
      {chunks.map((chunk, index) => {
        const { collection } = chunk;

        if (collection) {
          return (
            <StyledAccordion
              key={collection.id}
              title={collection.name}
              open={collection.open}
              onOpenChange={(open) => updateCollection(collection.id, { open })}
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
            </StyledAccordion>
          );
        }

        return (
          <Fragment key="default">
            {index > 0 && <Divider />}

            <DefaultCollection>
              {props.render({ ...chunk, createCollection }, index)}
            </DefaultCollection>
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
                  open: true,
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
