import { IconAlertTriangle } from "@tabler/icons-react";

import { t } from "~/common/helpers";

import ConfirmationModal from "./ConfirmationModal";

interface DeleteModalProps {
  name?: string;

  onCancel(): void;
  onConfirm(): void;
}

function DeleteModal(props: DeleteModalProps) {
  const { name = t("optionValue_unknown"), ...rest } = props;

  return (
    <ConfirmationModal
      {...rest}
      icon={<IconAlertTriangle size="2.5rem" strokeWidth={1.5} />}
      message={t("confirmMessage_deleteItem", name)}
      title={t("confirmTitle_deleteItem")}
    />
  );
}

export default DeleteModal;
