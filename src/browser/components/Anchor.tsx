import React, { FC, MouseEventHandler, ReactNode } from "react";

import { openUrl } from "@/common/helpers";

export interface AnchorProps {
  children?: ReactNode;
  className?: string;
  to: string;
}

const Anchor: FC<AnchorProps> = (props) => {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => openUrl(props.to, event);

  return (
    <a className={props.className} href={props.to} onClick={handleClick} onAuxClick={handleClick}>
      {props.children}
    </a>
  );
};

export default Anchor;
