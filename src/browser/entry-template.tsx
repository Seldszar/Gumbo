import "overlayscrollbars/overlayscrollbars.css";

import { Global } from "@emotion/react";
import { EntryWrapper } from "@seldszar/yael";
import { ExoticComponent, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { SWRConfig } from "swr";
import tw, { GlobalStyles, css, theme } from "twin.macro";

import { getBaseFontSize, t } from "~/common/helpers";

import { usePreferDarkMode, useSettings } from "./hooks";

const wrapper: EntryWrapper<ExoticComponent> = (Component) => {
  document.title = t("extensionName");

  document.documentElement.dir = t("@@bidi_dir");
  document.documentElement.lang = t("@@ui_locale");

  const container = document.getElementById("app-root");

  if (container == null) {
    return;
  }

  const root = createRoot(container);

  function App() {
    const [settings] = useSettings();

    const darkMode = usePreferDarkMode();

    useEffect(() => {
      const force =
        settings.general.theme === "system" ? darkMode : settings.general.theme === "dark";

      document.documentElement.classList.toggle("dark", force);
    }, [darkMode, settings.general.theme]);

    return (
      <SWRConfig value={{ keepPreviousData: true }}>
        <GlobalStyles />

        <Global
          styles={css`
            ::selection {
              ${tw`bg-purple-500 text-white`}
            }

            html,
            body {
              font-size: ${getBaseFontSize(settings.general.fontSize)};
            }

            html {
              color-scheme: dark;
            }

            body {
              ${tw`bg-neutral-100 font-sans text-black dark:(bg-neutral-900 text-white)`}
            }

            #modal-root {
              ${tw`absolute z-50`}
            }

            .os-theme-gumbo {
              --os-handle-bg-active: ${theme("colors.purple.600")};
              --os-handle-bg-hover: ${theme("colors.purple.400")};
              --os-handle-bg: ${theme("colors.purple.500")};
              --os-handle-border-radius: ${theme("borderRadius.full")};
              --os-handle-interactive-area-offset: 3px;
              --os-padding-axis: 3px;
              --os-padding-perpendicular: 3px;
              --os-size: 8px;

              .os-scrollbar-handle {
                opacity: 0.5;
              }

              &:hover {
                --os-size: 10px;

                .os-scrollbar-handle {
                  opacity: 1;
                }
              }
            }
          `}
        />

        <Component />
      </SWRConfig>
    );
  }

  root.render(<App />);
};

export default wrapper;
