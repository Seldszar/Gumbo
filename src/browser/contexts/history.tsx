import { Location, Router } from "@remix-run/router";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

interface HistoryContext {
  locations: Location[];
}

const Context = createContext<HistoryContext>({
  locations: [],
});

interface HistoryProviderProps {
  children: ReactNode;
  router: Router;
}

export function HistoryProvider(props: HistoryProviderProps) {
  const [locations, setLocations] = useState(new Array<Location>());

  useEffect(
    () =>
      props.router.subscribe((state) => {
        const { historyAction, location } = state;

        switch (historyAction) {
          case "PUSH":
            return setLocations((locations) => {
              if (locations.some(({ key }) => key === location.key)) {
                return locations;
              }

              return locations.concat(location);
            });

          case "POP":
            return setLocations((locations) => locations.slice(0, -1));
        }
      }),
    []
  );

  return <Context.Provider value={{ locations }}>{props.children}</Context.Provider>;
}

export function useHistoryContext() {
  return useContext(Context);
}
