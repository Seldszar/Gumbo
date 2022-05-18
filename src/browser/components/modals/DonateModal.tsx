import React, { FC } from "react";
import tw, { styled } from "twin.macro";

import Anchor from "../Anchor";
import Button from "../Button";
import Modal from "../Modal";
import Panel from "../Panel";
import Section from "../Section";

const allDonateButtons = [
  {
    name: "PayPal",
    url: "https://go.seldszar.fr/paypal",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M10 13l2.5 0c2.5 0 5 -2.5 5 -5c0 -3 -1.9 -5 -5 -5h-5.5c-.5 0 -1 .5 -1 1l-2 14c0 .5 .5 1 1 1h2.8l1.2 -5c.1 -.6 .4 -1 1 -1zm7.5 -5.8c1.7 1 2.5 2.8 2.5 4.8c0 2.5 -2.5 4.5 -5 4.5h-2.6l-.6 3.6a1 1 0 0 1 -1 .8l-2.7 0a0.5 .5 0 0 1 -.5 -.6l.2 -1.4" />
      </svg>
    ),
  },
  {
    name: "Coinbase",
    url: "https://go.seldszar.fr/coinbase",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M6 6h8a3 3 0 0 1 0 6a3 3 0 0 1 0 6h-8" />
        <line x1="8" y1="6" x2="8" y2="18" />
        <line x1="8" y1="12" x2="14" y2="12" />
        <line x1="9" y1="3" x2="9" y2="6" />
        <line x1="13" y1="3" x2="13" y2="6" />
        <line x1="9" y1="18" x2="9" y2="21" />
        <line x1="13" y1="18" x2="13" y2="21" />
      </svg>
    ),
  },
];

const ButtonGrid = styled.div`
  ${tw`grid gap-2`}
`;

interface DonateModalProps {
  onClose?(): void;
  isOpen?: boolean;
}

const DonateModal: FC<DonateModalProps> = (props) => (
  <Modal isOpen={props.isOpen}>
    <Panel title="Donate" onClose={props.onClose}>
      <Section>
        <p>Gumbo is a free extension that does not collect or sell personal user data.</p>
        <p>
          Donations, although optional but greatly appreciated, help support my work and encourage
          me to offer the best quality products possible.
        </p>
        <p>Thank you for your support!</p>
      </Section>
      <Section>
        <ButtonGrid>
          {allDonateButtons.map((props, index) => (
            <Anchor key={index} href={props.url}>
              <Button fullWidth icon={props.icon}>
                Donate with {props.name}
              </Button>
            </Anchor>
          ))}
        </ButtonGrid>
      </Section>
    </Panel>
  </Modal>
);

export default DonateModal;
