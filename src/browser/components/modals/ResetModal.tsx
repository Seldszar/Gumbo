import { IconAlertTriangle } from "@tabler/icons-react";

import { t } from "~/common/helpers";

import ConfirmationModal from "./ConfirmationModal";

interface ResetModalProps {
  onCancel(): void;
  onConfirm(): void;
}

function ResetModal(props: ResetModalProps) {
  return (
    <ConfirmationModal
      {...props}
      icon={<IconAlertTriangle size="2.5rem" strokeWidth={1.5} />}
      message={t("confirmMessage_reset")}
      title={t("confirmTitle_reset")}
    />
  );
}

export default ResetModal;
