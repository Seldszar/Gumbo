import React, { FC } from "react";
import { useAsyncFn } from "react-use";
import tw, { styled } from "twin.macro";
import browser from "webextension-polyfill";

import Button from "@/browser/components/Button";
import Hero from "@/browser/components/Hero";
import Section from "@/browser/components/Section";

const Wrapper = styled.div`
  ${tw`flex flex-1 flex-col h-full items-center justify-center px-16 text-center`}
`;

const Welcome: FC = () => {
  const [{ loading }, onButtonClick] = useAsyncFn(() =>
    browser.runtime.sendMessage({ type: "authorize" })
  );

  return (
    <Wrapper>
      <Section>
        <Hero />
      </Section>
      <Section>
        <Button
          color="purple"
          onClick={onButtonClick}
          isLoading={loading}
          icon={
            <svg viewBox="0 0 24 24">
              <path d="M4 5v11a1 1 0 0 0 1 1h2v4l4 -4h5.584c.266 0 .52 -.105 .707 -.293l2.415 -2.414c.187 -.188 .293 -.442 .293 -.708v-8.585a1 1 0 0 0 -1 -1h-14a1 1 0 0 0 -1 1z" />
              <line x1="16" y1="8" x2="16" y2="12" />
              <line x1="12" y1="8" x2="12" y2="12" />
            </svg>
          }
        >
          Login with Twitch
        </Button>
      </Section>
    </Wrapper>
  );
};

export default Welcome;
