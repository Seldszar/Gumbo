import { css, Global } from "@emotion/react";
import { IconBrandTwitch } from "@tabler/icons-react";
import { useMemo } from "react";
import { isRouteErrorResponse, Outlet, useRouteError } from "react-router";
import tw, { styled } from "twin.macro";

import { sendRuntimeMessage, t } from "~/common/helpers";
import { HistoryProvider, SearchProvider } from "~/browser/contexts";
import { useCurrentUser } from "~/browser/hooks";

import Button from "~/browser/components/Button";
import Hero from "~/browser/components/Hero";
import Loader from "~/browser/components/Loader";
import Section from "~/browser/components/Section";
import Sidebar from "~/browser/components/Sidebar";
import Splash from "~/browser/components/Splash";

const Wrapper = styled.div`
  ${tw`flex h-full relative`}
`;

const Body = styled.div`
  ${tw`flex-1 overflow-hidden`}
`;

const Welcome = styled.div`
  ${tw`flex flex-1 flex-col h-full items-center justify-center px-16 text-center`}
`;

export function ChildComponent() {
  const [currentUser] = useCurrentUser({
    suspense: true,
  });

  if (currentUser == null) {
    return (
      <Welcome>
        <Section>
          <Hero />
        </Section>
        <Section>
          <Button
            color="purple"
            onClick={() => sendRuntimeMessage("authorize")}
            icon={<IconBrandTwitch size="1.5rem" strokeWidth={1.5} />}
          >
            {t("buttonText_login")}
          </Button>
        </Section>
      </Welcome>
    );
  }

  return (
    <>
      <Sidebar user={currentUser} />

      <Body>
        <Outlet />
      </Body>
    </>
  );
}

export function Component() {
  return (
    <HistoryProvider>
      <SearchProvider>
        <Global
          styles={css`
            #app-root {
              height: 600px;
              width: 420px;
            }
          `}
        />

        <Wrapper>
          <Loader>
            <ChildComponent />
          </Loader>
        </Wrapper>
      </SearchProvider>
    </HistoryProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  const title = useMemo(() => {
    if (isRouteErrorResponse(error)) {
      return error.statusText;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "Unknown error";
  }, [error]);

  return <Splash>{title}</Splash>;
}

export default Component;
