import { IconBrandTwitch } from "@tabler/icons-react";
import tw, { styled } from "twin.macro";

import { sendRuntimeMessage, t } from "~/common/helpers";

import Button from "~/browser/components/Button";
import Hero from "~/browser/components/Hero";
import Section from "~/browser/components/Section";

const Wrapper = styled.div`
  ${tw`flex flex-1 flex-col h-full items-center justify-center px-16 text-center`}
`;

function Welcome() {
  return (
    <Wrapper>
      <Section>
        <Hero />
      </Section>
      <Section>
        <Button
          color="purple"
          onClick={() => sendRuntimeMessage("authorize")}
          icon={<IconBrandTwitch size="1.5rem" strokeWidth={1.5} />}
        >
          {t("buttonText_login")}
        </Button>
      </Section>
    </Wrapper>
  );
}

export default Welcome;
