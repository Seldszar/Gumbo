import React, { FC } from "react";
import tw, { styled } from "twin.macro";

import ExternalAnchor from "../ExternalAnchor";
import Hero from "../Hero";
import Modal from "../Modal";
import Panel from "../Panel";
import Section from "../Section";

const LinkList = styled.div`
  ${tw`flex flex-wrap justify-center gap-x-6`}
`;

const Link = styled(ExternalAnchor)``;

interface AboutModalProps {
  onClose?(): void;
  isOpen?: boolean;
}

const AboutModal: FC<AboutModalProps> = (props) => (
  <Modal isOpen={props.isOpen}>
    <Panel onClose={props.onClose}>
      <Section>
        <Hero />
      </Section>
      <Section>
        <LinkList>
          <Link href="https://github.com/seldszar/gumbo">Repository</Link>
          <Link href="https://github.com/seldszar/gumbo/issues">Support</Link>
          <Link href="https://github.com/seldszar/gumbo/releases">Release Notes</Link>
        </LinkList>
      </Section>
    </Panel>
  </Modal>
);

export default AboutModal;
