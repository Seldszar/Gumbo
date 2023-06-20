import { useMemo } from "react";

import { t } from "~/common/helpers";
import { Collection } from "~/common/types";

import Modal from "../Modal";
import Panel from "../Panel";

import CollectionForm from "../forms/CollectionForm";

interface CollectionModalProps {
  collection?: Collection;

  onCancel(): void;
  onSubmit(name: string): void;
}

function CollectionModal(props: CollectionModalProps) {
  const { collection, ...rest } = props;

  const title = useMemo(
    () => t(`titleText_${collection ? "update" : "create"}Collection`),
    [collection]
  );

  return (
    <Modal>
      <Panel title={title} onClose={rest.onCancel}>
        <CollectionForm {...rest} value={collection?.name} />
      </Panel>
    </Modal>
  );
}

export default CollectionModal;
