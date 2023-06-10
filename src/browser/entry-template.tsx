import type { EntryWrapper } from "@seldszar/yael";

import { Global } from "@emotion/react";
import { domAnimation, LazyMotion } from "framer-motion";
import { ExoticComponent, useEffect } from "react";
import { createRoot } from "react-dom/client";
import tw, { GlobalStyles, css, theme } from "twin.macro";

import { getBaseFontSize, setupSentry, t } from "~/common/helpers";

import { useSettings } from "./hooks";

setupSentry();

const wrapper: EntryWrapper<ExoticComponent> = (Component) => {
  const container = document.getElementById("app-root");

  if (container == null) {
    return;
  }

  const root = createRoot(container);

  document.documentElement.dir = t("@@bidi_dir");
  document.documentElement.lang = t("@@ui_locale");

  function App() {
    const [settings] = useSettings();

    useEffect(() => {
      document.documentElement.classList.toggle("dark", settings.general.theme === "dark");
    }, [settings.general.theme]);

    return (
      <LazyMotion features={domAnimation} strict>
        <GlobalStyles />

        <Global
          styles={css`
            ::selection {
              ${tw`bg-purple-500 text-white`}
            }

            ::-webkit-scrollbar {
              ${tw`bg-black/10 dark:bg-black/25 h-2 w-2`}
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
            }

            body {
              ${tw`bg-neutral-100 font-sans text-black overflow-hidden dark:(bg-neutral-900 text-white)`}
            }

            #modal-root {
              ${tw`absolute z-50`}
            }
          `}
        />

        <Component />
      </LazyMotion>
    );
  }

  root.render(<App />);
};

export default wrapper;
