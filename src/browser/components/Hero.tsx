import { styled } from "~/browser/styled-system/jsx";

import Logo from "./Logo";
import Wordmark from "./Wordmark";

const Wrapper = styled("div", {
  base: {
    alignItems: "center",
    display: "flex",
    flexDir: "column",
    textAlign: "center",
  },
});

const StyledLogo = styled(Logo, {
  base: {
    mb: 4,
    mx: "auto",
    w: 16,
  },
});

const StyledWordmark = styled(Wordmark, {
  base: {
    mb: 1,
    w: 36,
  },
});

const Author = styled("div", {
  base: {
    fontSize: "sm",
    mb: 4,
    textAlign: "center",

    "& a": {
      _hover: {
        textDecoration: "underline",
      },
    },
  },
});

const Description = styled("div", {
  base: {
    color: { base: "neutral.600", _dark: "neutral.400" },
    lineHeight: "tight",
  },
});

interface HeroProps {
  className?: string;
}

function Hero(props: HeroProps) {
  const manifest = browser.runtime.getManifest();

  return (
    <Wrapper className={props.className}>
      <StyledLogo />
      <StyledWordmark />
      <Author>
        by{" "}
        <a href="https://seldszar.fr" target="_blank" rel="noopener noreferrer">
          Seldszar
        </a>
      </Author>
      <Description>{manifest.description}</Description>
    </Wrapper>
  );
}

export default Hero;
