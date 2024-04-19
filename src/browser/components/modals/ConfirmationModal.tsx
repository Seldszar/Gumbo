import { ReactNode } from "react";

import { t } from "~/common/helpers";

import { styled } from "~/browser/styled-system/jsx";

import Button from "../Button";
import Modal from "../Modal";
import Renderer from "../Renderer";

const Panel = styled("div", {
  base: {
    alignItems: "center",
    display: "flex",
    flexDir: "column",
    textAlign: "center",
  },
});

const Title = styled("div", {
  base: {
    fontSize: "xl",
  },
});

const Message = styled("div", {
  base: {
    color: { base: "neutral.600", _dark: "neutral.400" },
    mb: 6,
  },
});

const ButtonGroup = styled("div", {
  base: {
    display: "grid",
    gap: 3,
    gridTemplateColumns: 2,
  },
});

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
