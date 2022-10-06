import React, { FC, useMemo } from "react";
import tw, { styled } from "twin.macro";

const Login = styled.span`
  ${tw`font-normal`}
`;

export interface ChannelNameProps {
  className?: string;
  login: string;
  name: string;
}

const ChannelName: FC<ChannelNameProps> = (props) => {
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
    <div className={props.className} title={title}>
      {displayName} {isDifferent && <Login>({props.login})</Login>}
    </div>
  );
};

export default ChannelName;
