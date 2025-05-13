import { useMemo } from "react";

import { styled } from "~/browser/styled-system/jsx";

import Tooltip from "./Tooltip";

const Login = styled("span", {
  base: {
    fontWeight: "normal",
  },
});

export interface ChannelNameProps {
  className?: string;
  login: string;
  name: string;
}

function ChannelName(props: ChannelNameProps) {
  const displayName = useMemo(() => props.name || props.login, [props.login, props.name]);

  const isDifferent = useMemo(
    () => displayName.toLowerCase().trim() !== props.login.toLowerCase().trim(),
    [displayName, props.login],
  );

  const title = useMemo(
    () => `${displayName}${isDifferent ? ` (${props.login})` : ""}`,
    [displayName, isDifferent, props.login],
  );

  return (
    <div className={props.className}>
      <Tooltip title={title}>
        <span>
          {displayName} {isDifferent && <Login>({props.login})</Login>}
        </span>
      </Tooltip>
    </div>
  );
}

export default ChannelName;
