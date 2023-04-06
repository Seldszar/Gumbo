import { IconReload, TablerIconsProps } from "@tabler/icons-react";

import tw, { styled } from "twin.macro";

interface IconProps {
  isSpinning?: boolean;
}

const Icon = styled(IconReload)<IconProps>`
  ${(props) => props.isSpinning && tw`animate-spin`}
`;

export interface ReloadIconProps extends TablerIconsProps {
  isSpinning?: boolean;
}

function ReloadIcon(props: ReloadIconProps) {
  return <Icon {...props} />;
}

export default ReloadIcon;
