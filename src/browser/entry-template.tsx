import { Global } from "@emotion/react";
import { EntryWrapper } from "@seldszar/yael";
import { ExoticComponent, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { SWRConfig } from "swr";
import tw, { GlobalStyles, css } from "twin.macro";

import { getBaseFontSize, setupSentry, t } from "~/common/helpers";

import { usePreferDarkMode, useSettings } from "./hooks";

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
          `}
        />

        <Component />
      </SWRConfig>
    );
  }

  root.render(<App />);
};

export default wrapper;
