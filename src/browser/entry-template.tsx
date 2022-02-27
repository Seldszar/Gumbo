import type { EntryWrapper } from "@seldszar/yael";

import { Global } from "@emotion/react";
import { domAnimation, LazyMotion } from "framer-motion";
import React, { ExoticComponent } from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { SWRConfig } from "swr";
import tw, { GlobalStyles, css, theme } from "twin.macro";

import { backgroundFetcher } from "./helpers/queries";

const wrapper: EntryWrapper<ExoticComponent> = (Component, { target }) => {
  const App = (
    <SWRConfig value={{ fetcher: backgroundFetcher }}>
      <HashRouter>
        <LazyMotion features={domAnimation} strict>
          <GlobalStyles />

          <Global
            styles={css`
              ::selection {
                ${tw`bg-purple-500 text-white`}
              }

              ::-webkit-scrollbar {
                ${tw`bg-black/25`}

                height: ${theme("spacing.2")};
                width: ${theme("spacing.2")};
              }

              ::-webkit-scrollbar-track,
              ::-webkit-scrollbar-thumb {
                background-clip: padding-box;
                border: 1px solid ${theme`colors.transparent`};
              }

              ::-webkit-scrollbar-thumb {
                ${tw`bg-purple-500 hover:bg-purple-600 active:bg-purple-400`}
              }

              * {
                scrollbar-color: ${theme`colors.purple.500`} ${theme`colors.transparent`};
                scrollbar-width: thin;
              }

              html,
              body {
                font-size: 14px;
                height: 600px;
                width: 420px;
              }

              body {
                ${tw`bg-neutral-900 text-white overflow-hidden`}
              }
            `}
          />

          <Component />
        </LazyMotion>
      </HashRouter>
    </SWRConfig>
  );

  if (target === "web") {
    ReactDOM.render(App, document.body);
  }
};

export default wrapper;
