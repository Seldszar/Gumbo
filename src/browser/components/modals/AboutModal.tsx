import React, { FC } from "react";
import tw, { styled } from "twin.macro";

import ExternalAnchor from "../ExternalAnchor";
import Hero from "../Hero";
import Modal from "../Modal";
import Panel from "../Panel";
import Section from "../Section";

const allLinks = [
  {
    title: "Source Code",
    url: "https://github.com/seldszar/gumbo",
  },
  {
    title: "Bugs & Suggestions",
    url: "https://github.com/seldszar/gumbo/issue",
  },
  {
    title: "Release Notes",
    url: "https://github.com/seldszar/gumbo/releases",
  },
];

const LinkList = styled.div`
  ${tw`flex flex-wrap justify-center gap-x-6`}
`;

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
          {allLinks.map((props, index) => (
            <ExternalAnchor key={index} href={props.url}>
              {props.title}
            </ExternalAnchor>
          ))}
        </LinkList>
      </Section>
    </Panel>
  </Modal>
);

export default AboutModal;
