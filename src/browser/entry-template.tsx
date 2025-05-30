import "./assets/styles/base.css";

import { EntryWrapper } from "@seldszar/yael";
import { ExoticComponent, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { SWRConfig } from "swr";

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

    useEffect(() => {
      document.documentElement.style.fontSize = getBaseFontSize(settings.general.fontSize);
    }, [settings.general.fontSize]);

    return (
      <SWRConfig value={{ keepPreviousData: true }}>
        <Component />
      </SWRConfig>
    );
  }

  root.render(<App />);
};

export default wrapper;
