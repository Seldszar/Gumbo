import React, { AnchorHTMLAttributes, forwardRef, MouseEventHandler } from "react";

import { openUrl } from "@/common/helpers";

const Anchor = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(
  (props, ref) => {
    const onClick: MouseEventHandler<HTMLAnchorElement> = (event) =>
      openUrl(event.currentTarget.href, event);

    const onAuxClick: MouseEventHandler<HTMLAnchorElement> = (event) =>
      openUrl(event.currentTarget.href, event);

    return <a {...props} ref={ref} onClick={onClick} onAuxClick={onAuxClick} />;
  }
);

export default Anchor;
