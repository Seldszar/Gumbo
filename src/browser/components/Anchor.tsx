import React, { AnchorHTMLAttributes, FC, MouseEventHandler } from "react";
import browser from "webextension-polyfill";

const Anchor: FC<AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => {
  const onAuxClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    switch (event.button) {
      case 1: {
        event.preventDefault();

        browser.tabs.create({
          url: event.currentTarget.href,
          active: false,
        });
      }
    }
  };

  return <a {...props} onAuxClick={onAuxClick} />;
};

export default Anchor;
