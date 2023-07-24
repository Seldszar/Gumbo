import { ReactNode } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import Button from "../Button";
import Modal from "../Modal";
import Renderer from "../Renderer";

const Panel = styled.div`
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

interface ConfirmationModalProps {
  icon?: ReactNode;

  title: string;
  message: string;

  onCancel(): void;
  onConfirm(): void;
}

function ConfirmationModal(props: ConfirmationModalProps) {
  return (
    <Modal>
      <Panel>
        {props.icon}

        <Title>{props.title}</Title>
        <Message>
          <Renderer content={props.message} />
        </Message>

        <ButtonGroup>
          <Button color="transparent" onClick={props.onCancel}>
            {t("buttonText_cancel")}
          </Button>
          <Button color="red" onClick={props.onConfirm}>
            {t("buttonText_confirm")}
          </Button>
        </ButtonGroup>
      </Panel>
    </Modal>
  );
}

export default ConfirmationModal;
