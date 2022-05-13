import React, { FC, MouseEventHandler } from "react";
import tw, { styled } from "twin.macro";

import Button from "../Button";
import Modal from "../Modal";

const Inner = styled.div`
  ${tw`flex flex-col items-center text-center`}
`;

const Icon = styled.svg`
  ${tw`stroke-current w-10`}

  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5px;
`;

const Title = styled.div`
  ${tw`text-xl`}
`;

const Mesage = styled.div`
  ${tw`mb-6 text-black/50 dark:text-white/50`}
`;

const ButtonGroup = styled.div`
  ${tw`gap-3 grid grid-cols-2`}
`;

interface ResetModalProps {
  onCancel?: MouseEventHandler<HTMLButtonElement>;
  onConfirm?: MouseEventHandler<HTMLButtonElement>;
  isOpen?: boolean;
}

const ResetModal: FC<ResetModalProps> = (props) => (
  <Modal isOpen={props.isOpen}>
    <Inner>
      <Icon viewBox="0 0 24 24">
        <path d="M12 9v2m0 4v.01" />
        <path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75" />
      </Icon>

      <Title>You are about to reset Gumbo!</Title>
      <Mesage>
        All data is going to be deleted and you will be logged out.
        <br />
        Are you sure you want to proceed?
      </Mesage>

      <ButtonGroup>
        <Button color="red" onClick={props.onConfirm}>
          Confirm
        </Button>
        <Button color="transparent" onClick={props.onCancel}>
          Cancel
        </Button>
      </ButtonGroup>
    </Inner>
  </Modal>
);

export default ResetModal;
