import React, { FC, MouseEventHandler } from "react";
import tw, { styled } from "twin.macro";

import { t } from "@/common/helpers";

import ExternalAnchor from "../ExternalAnchor";
import Hero from "../Hero";
import Modal from "../Modal";
import Panel from "../Panel";
import Section from "../Section";

const allLinks = [
  {
    title: t("linkText_repository"),
    url: "https://github.com/seldszar/gumbo",
  },
  {
    title: t("linkText_issues"),
    url: "https://github.com/seldszar/gumbo/issues",
  },
  {
    title: t("linkText_releases"),
    url: "https://github.com/seldszar/gumbo/releases",
  },
];

const LinkList = styled.div`
  ${tw`flex flex-wrap justify-center gap-x-6`}
`;

interface AboutModalProps {
  onClose?: MouseEventHandler<HTMLButtonElement>;
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
