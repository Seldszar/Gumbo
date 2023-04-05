import { IconExternalLink } from "@tabler/icons-react";
import tw, { styled } from "twin.macro";

import Anchor, { AnchorProps } from "./Anchor";

const Icon = styled(IconExternalLink)`
  ${tw`flex-none opacity-50`}
`;

const Inner = styled.span`
  ${tw`flex-1`}
`;

const Wrapper = styled(Anchor)`
  ${tw`inline-flex items-center gap-1 hover:underline`}
`;

function ExternalAnchor(props: AnchorProps) {
  return (
    <Wrapper className={props.className} to={props.to}>
      <Inner>{props.children}</Inner>
      <Icon size="1rem" />
    </Wrapper>
  );
}

export default ExternalAnchor;
