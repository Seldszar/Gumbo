import { IconAlertTriangle } from "@tabler/icons-react";
import { MouseEventHandler } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import Button from "../Button";
import Modal from "../Modal";
import Renderer from "../Renderer";

const Inner = styled.div`
  ${tw`flex flex-col items-center text-center`}
`;

const Title = styled.div`
  ${tw`text-xl`}
`;

const Message = styled.div`
  ${tw`mb-6 text-neutral-600 dark:text-neutral-400`}
`;

const ButtonGroup = styled.div`
  ${tw`gap-3 grid grid-cols-2`}
`;

interface ResetModalProps {
  onCancel?: MouseEventHandler<HTMLButtonElement>;
  onConfirm?: MouseEventHandler<HTMLButtonElement>;
  isOpen?: boolean;
}

function ResetModal(props: ResetModalProps) {
  return (
    <Modal isOpen={props.isOpen}>
      <Inner>
        <IconAlertTriangle size="2.5rem" strokeWidth={1.5} />

        <Title>{t("confirmTitle_reset")}</Title>
        <Message>
          <Renderer content={t("confirmMessage_reset")} />
        </Message>

        <ButtonGroup>
          <Button color="red" onClick={props.onConfirm}>
            {t("buttonText_confirm")}
          </Button>
          <Button color="transparent" onClick={props.onCancel}>
            {t("buttonText_cancel")}
          </Button>
        </ButtonGroup>
      </Inner>
    </Modal>
  );
}

export default ResetModal;
