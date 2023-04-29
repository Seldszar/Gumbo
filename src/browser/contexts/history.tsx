import { Location, Router } from "@remix-run/router";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

const Context = createContext(new Array<Location>());

interface HistoryProviderProps {
  children: ReactNode;
  router: Router;
}

export function HistoryProvider(props: HistoryProviderProps) {
  const [stack, setStack] = useState(new Array<Location>());

  useEffect(
    () =>
      props.router.subscribe((state) => {
        const { historyAction, location } = state;

        switch (historyAction) {
          case "PUSH":
            return setStack((stack) => {
              if (stack.some((item) => item.key === location.key)) {
                return stack;
              }

              return stack.concat(location);
            });

          case "POP":
            return setStack((stack) => stack.slice(0, -1));
        }
      }),
    []
  );

  return <Context.Provider value={stack}>{props.children}</Context.Provider>;
}

export function useHistoryContext() {
  return useContext(Context);
}
