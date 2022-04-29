import React, { FC } from "react";
import browser from "webextension-polyfill";

import Alert from "@/browser/components/Alert";

const ReloadAlert: FC = () => (
  <Alert
    onClick={() => browser.runtime.reload()}
    icon={
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    }
  >
    <p>Looks like Gumbo is not responding anymore.</p>
    <p>Click to reload the extension.</p>
  </Alert>
);

export default ReloadAlert;
