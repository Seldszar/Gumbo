import { IconExternalLink } from "@tabler/icons-react";

import { styled } from "~/browser/styled-system/jsx";

import Anchor, { AnchorProps } from "./Anchor";

const Icon = styled(IconExternalLink, {
  base: {
    flex: "none",
    opacity: 0.5,
  },
});

const Inner = styled("span", {
  base: {
    flex: 1,
  },
});

const Wrapper = styled(Anchor, {
  base: {
    alignItems: "center",
    display: "inline-flex",
    gap: 1,

    _hover: {
      textDecoration: "underline",
    },
  },
});

function ExternalAnchor(props: AnchorProps) {
  return (
    <Wrapper className={props.className} to={props.to}>
      <Inner>{props.children}</Inner>
      <Icon size="1rem" />
    </Wrapper>
  );
}

export default ExternalAnchor;
