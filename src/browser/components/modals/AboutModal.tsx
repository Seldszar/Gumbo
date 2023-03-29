import { FC, MouseEventHandler } from "react";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

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
  {
    title: t("linkText_translate"),
    url: "https://hosted.weblate.org/projects/gumbo",
  },
];

const LinkGrid = styled.div`
  ${tw`grid grid-cols-2 gap-x-6 gap-y-1 place-items-center`}
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
        <LinkGrid>
          {allLinks.map((props, index) => (
            <ExternalAnchor key={index} to={props.url}>
              {props.title}
            </ExternalAnchor>
          ))}
        </LinkGrid>
      </Section>
    </Panel>
  </Modal>
);

export default AboutModal;
