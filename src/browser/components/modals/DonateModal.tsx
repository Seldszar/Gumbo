import { IconBrandCoinbase, IconBrandPaypal } from "@tabler/icons-react";
import { MouseEventHandler } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import Anchor from "../Anchor";
import Button from "../Button";
import Modal from "../Modal";
import Panel from "../Panel";
import Renderer from "../Renderer";
import Section from "../Section";

const allDonateButtons = [
  {
    name: "PayPal",
    url: "https://go.seldszar.fr/paypal",
    icon: <IconBrandPaypal size="1.5rem" strokeWidth={1.5} />,
  },
  {
    name: "Coinbase",
    url: "https://go.seldszar.fr/coinbase",
    icon: <IconBrandCoinbase size="1.5rem" strokeWidth={1.5} />,
  },
];

const ButtonGrid = styled.div`
  ${tw`grid gap-2`}
`;

interface DonateModalProps {
  onClose?: MouseEventHandler<HTMLButtonElement>;
}

function DonateModal(props: DonateModalProps) {
  return (
    <Modal>
      <Panel title={t("titleText_donate")} onClose={props.onClose}>
        <Section>
          <Renderer content={t("messageText_donate")} />
        </Section>
        <Section>
          <ButtonGrid>
            {allDonateButtons.map((props, index) => (
              <Anchor key={index} to={props.url}>
                <Button fullWidth icon={props.icon}>
                  {t("buttonText_donateWith", props.name)}
                </Button>
              </Anchor>
            ))}
          </ButtonGrid>
        </Section>
      </Panel>
    </Modal>
  );
}

export default DonateModal;
