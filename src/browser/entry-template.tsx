import type { EntryWrapper } from "@seldszar/yael";

import { Global } from "@emotion/react";
import { domAnimation, LazyMotion } from "framer-motion";
import React, { ExoticComponent, FC, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { SWRConfig } from "swr";
import tw, { GlobalStyles, css, theme } from "twin.macro";

import { getBaseFontSize, setupErrorTracking, t } from "@/common/helpers";

import { useSettings } from "./helpers/hooks";
import { backgroundFetcher } from "./helpers/queries";

setupErrorTracking();

const wrapper: EntryWrapper<ExoticComponent> = (Component) => {
  const root = createRoot(document.body);

  document.documentElement.dir = t("@@bidi_dir");
  document.documentElement.lang = t("@@ui_locale");

  const App: FC = () => {
    const [settings] = useSettings();

    useEffect(() => {
      document.documentElement.classList.toggle("dark", settings.general.theme === "dark");
    }, [settings.general.theme]);

    return (
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
                  ${tw`bg-black/10 dark:bg-black/25`}

                  height: ${theme`spacing.2`};
                  width: ${theme`spacing.2`};
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
                  font-size: ${getBaseFontSize(settings.general.fontSize)};
                  height: 600px;
                  width: 420px;
                }

                body {
                  ${tw`bg-neutral-100 text-black overflow-hidden dark:(bg-neutral-900 text-white)`}
                }
              `}
            />

            <Component />
          </LazyMotion>
        </HashRouter>
      </SWRConfig>
    );
  };

  root.render(<App />);
};

export default wrapper;
