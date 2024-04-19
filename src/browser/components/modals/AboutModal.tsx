import { MouseEventHandler } from "react";

import { t } from "~/common/helpers";

import { styled } from "~/browser/styled-system/jsx";

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

const LinkGrid = styled("div", {
  base: {
    columnGap: 6,
    display: "grid",
    gridTemplateColumns: 2,
    placeItems: "center",
    rowGap: 1,
  },
});

interface AboutModalProps {
  onClose?: MouseEventHandler<HTMLButtonElement>;
}

function AboutModal(props: AboutModalProps) {
  return (
    <Modal>
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
}

export default AboutModal;
