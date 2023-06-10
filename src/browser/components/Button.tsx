import { PropsOf } from "@emotion/react";
import { ReactNode, forwardRef } from "react";
import tw, { css, styled } from "twin.macro";

import Spinner from "./Spinner";

const Icon = styled.div`
  ${tw`flex-none`}
`;

const Inner = styled.div``;

const Loading = styled.div`
  ${tw`absolute grid inset-0 place-content-center`}
`;

const StyledSpinner = styled(Spinner)`
  ${tw`text-white w-6`}
`;

interface WrapperProps {
  isLoading?: boolean;
  fullWidth?: boolean;
  color?: string;
}

const Wrapper = styled.button<WrapperProps>`
  ${tw`flex gap-2 place-content-center px-4 py-2 relative rounded transition disabled:(cursor-default opacity-25)!`}

  ${(props) =>
    props.isLoading &&
    css`
      ${Inner} {
        ${tw`invisible`}
      }
    `}

  ${(props) => {
    switch (props.color) {
      case "purple":
        return tw`bg-purple-500 hover:bg-purple-400 active:bg-purple-600 disabled:bg-purple-500!`;

      case "red":
        return tw`bg-red-500 hover:bg-red-400 active:bg-red-600 disabled:bg-red-500!`;

      case "transparent":
        return tw`hover:bg-white/10 active:bg-black/25 disabled:bg-transparent!`;

      default:
        return tw`bg-neutral-300 hover:bg-neutral-400 active:bg-neutral-200 disabled:bg-neutral-300! dark:(bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-800 disabled:bg-neutral-700!)`;
    }
  }}

  ${(props) => props.fullWidth && tw`w-full`}
`;

export interface ButtonProps extends PropsOf<typeof Wrapper> {
  children?: ReactNode;
  icon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { children, icon, ...rest } = props;

  return (
    <Wrapper {...rest} ref={ref} disabled={rest.disabled || rest.isLoading}>
      {icon && <Icon>{icon}</Icon>}

      <Inner>{children}</Inner>

      {rest.isLoading && (
        <Loading>
          <StyledSpinner />
        </Loading>
      )}
    </Wrapper>
  );
});

export default Button;
