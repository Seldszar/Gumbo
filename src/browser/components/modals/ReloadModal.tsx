import { FC } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import Button from "../Button";
import Modal from "../Modal";
import Renderer from "../Renderer";

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

const Message = styled.div`
  ${tw`mb-6 text-neutral-600 dark:text-neutral-400`}
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

      <Title>{t("confirmTitle_reload")}</Title>
      <Message>
        <Renderer content={t("confirmMessage_reload")} />
      </Message>

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
        {t("buttonText_reloadExtension")}
      </Button>
    </Inner>
  </Modal>
);

export default ReloadModal;
