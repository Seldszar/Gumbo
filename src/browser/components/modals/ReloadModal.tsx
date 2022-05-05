import React, { FC } from "react";
import tw, { styled } from "twin.macro";
import browser from "webextension-polyfill";

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

interface ReloadModalProps {
  isOpen?: boolean;
}

const ReloadModal: FC<ReloadModalProps> = (props) => (
  <Modal isOpen={props.isOpen}>
    <Inner>
      <Icon viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <line x1="9" y1="10" x2="9.01" y2="10" />
        <line x1="15" y1="10" x2="15.01" y2="10" />
        <path d="M9.5 15.25a3.5 3.5 0 0 1 5 0" />
      </Icon>

      <Title>Uh-oh, Gumbo is not responding anymore!</Title>
      <Mesage>Please use the button below to reload the extension</Mesage>

      <Button
        color="purple"
        icon={
          <svg viewBox="0 0 24 24">
            <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
            <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
          </svg>
        }
        onClick={() => browser.runtime.reload()}
      >
        Reload the extension
      </Button>
    </Inner>
  </Modal>
);

export default ReloadModal;
