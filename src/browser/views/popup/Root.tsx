import { Outlet } from "react-router-dom";
import tw, { styled } from "twin.macro";

import { useCurrentUser } from "~/browser/helpers/hooks";

import Welcome from "~/browser/views/popup/Welcome";

import Sidebar from "~/browser/components/Sidebar";
import Splash from "~/browser/components/Splash";

const Wrapper = styled.div`
  ${tw`flex flex-col h-full relative`}
`;

const Inner = styled.div`
  ${tw`flex flex-1 overflow-hidden`}
`;

const Body = styled.div`
  ${tw`flex-1 overflow-y-scroll`}
`;

function Root() {
  const [currentUser, { isLoading }] = useCurrentUser();

  if (isLoading) {
    return <Splash isLoading />;
  }

  if (currentUser == null) {
    return <Welcome />;
  }

  return (
    <Wrapper>
      <Inner>
        <Sidebar user={currentUser} />

        <Body>
          <Outlet />
        </Body>
      </Inner>
    </Wrapper>
  );
}

export default Root;
