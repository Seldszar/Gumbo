import { ReactNode, FC } from "react";
import { useTitle } from "react-use";
import tw, { styled } from "twin.macro";

import { t } from "~/common/helpers";

import Logo from "./Logo";
import Wordmark from "./Wordmark";

const Wrapper = styled.div`
  ${tw`h-screen overflow-y-scroll`}
`;

const Header = styled.div`
  ${tw`border-b border-neutral-200 dark:border-neutral-800 flex items-center p-6`}
`;

const StyledLogo = styled(Logo)`
  ${tw`flex-shrink-0 h-8`}
`;

const StyledWordmark = styled(Wordmark)`
  ${tw`flex-shrink-0 h-6 ltr:ml-2 rtl:mr-2`}
`;

const Divider = styled.div`
  ${tw`mx-6 text-neutral-600 dark:text-neutral-400`}
`;

const Title = styled.div`
  ${tw`flex-1 font-medium text-xl`}
`;

const Inner = styled.div`
  ${tw`p-6`}
`;

export interface PageProps {
  children?: ReactNode;
  className?: string;
  title?: ReactNode;
}

function Page(props: PageProps) {
  useTitle(`${props.title ? `${props.title} ━ ` : ""}${t("extensionName")}`);

  return (
    <Wrapper className={props.className}>
      <Header>
        <StyledLogo />
        <StyledWordmark />
        <Divider>━</Divider>
        <Title>{props.title}</Title>
      </Header>

      <Inner>{props.children}</Inner>
    </Wrapper>
  );
}

export default Page;
