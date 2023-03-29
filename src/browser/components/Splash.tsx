import { FC, ReactNode } from "react";
import tw, { styled } from "twin.macro";

import Spinner from "./Spinner";

const Wrapper = styled.div`
  ${tw`flex-1 gap-4 grid h-full place-content-center`}
`;

const StyledSpinner = styled(Spinner)`
  ${tw`mx-auto w-8`}
`;

const Inner = styled.div`
  ${tw`text-center text-lg`}
`;

export interface SplashProps {
  children?: ReactNode;
  className?: string;
  isLoading?: boolean;
}

const Splash: FC<SplashProps> = (props) => (
  <Wrapper>
    {props.isLoading && <StyledSpinner />}
    {props.children && <Inner>{props.children}</Inner>}
  </Wrapper>
);

export default Splash;
