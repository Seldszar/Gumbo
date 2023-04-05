import tw, { styled } from "twin.macro";

import Logo from "./Logo";
import Wordmark from "./Wordmark";

const Wrapper = styled.div`
  ${tw`flex flex-col items-center text-center`}
`;

const StyledLogo = styled(Logo)`
  ${tw`mb-4 mx-auto w-16`}
`;

const StyledWordmark = styled(Wordmark)`
  ${tw`mb-1 w-36`}
`;

const Author = styled.div`
  ${tw`mb-4 text-center text-sm`}

  a {
    ${tw`hover:underline`}
  }
`;

const Description = styled.div`
  ${tw`leading-tight text-neutral-600 dark:text-neutral-400`}
`;

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
