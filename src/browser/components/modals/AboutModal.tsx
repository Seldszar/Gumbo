import React, { FC } from "react";
import tw, { styled } from "twin.macro";

import ExternalAnchor from "../ExternalAnchor";
import Hero from "../Hero";
import Modal from "../Modal";
import Section from "../Section";

const LinkList = styled.div`
  ${tw`flex flex-wrap justify-center -mx-3`}
`;

const Link = styled(ExternalAnchor)`
  ${tw`mx-3`}
`;

interface AboutModalProps {
  onClose?(): void;
  isOpen?: boolean;
}

const AboutModal: FC<AboutModalProps> = (props) => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
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
    </Modal>
  );
};

export default AboutModal;
