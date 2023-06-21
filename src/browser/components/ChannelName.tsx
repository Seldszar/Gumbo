import { useMemo } from "react";
import tw, { styled } from "twin.macro";

import Tooltip from "./Tooltip";

const Login = styled.span`
  ${tw`font-normal`}
`;

export interface ChannelNameProps {
  className?: string;
  login: string;
  name: string;
}

function ChannelName(props: ChannelNameProps) {
  const displayName = useMemo(() => props.name || props.login, [props.login, props.name]);

  const isDifferent = useMemo(
    () => displayName.toLowerCase().trim() !== props.login.toLowerCase().trim(),
    [displayName, props.login]
  );

  const title = useMemo(
    () => `${displayName}${isDifferent ? ` (${props.login})` : ""}`,
    [displayName, isDifferent, props.login]
  );

  return (
    <div className={props.className}>
      <Tooltip content={title}>
        <span>
          {displayName} {isDifferent && <Login>({props.login})</Login>}
        </span>
      </Tooltip>
    </div>
  );
}

export default ChannelName;
