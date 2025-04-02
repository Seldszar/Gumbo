import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { DataRouter, Location } from "react-router";

interface HistoryContext {
  locations: Location[];
  index: number;
}

const Context = createContext<HistoryContext>({
  locations: [],
  index: 0,
});

interface HistoryProviderProps {
  children: ReactNode;
  router: DataRouter;
}

export function HistoryProvider(props: HistoryProviderProps) {
  const { router } = props;

  const [state, setState] = useState(() => {
    const { state } = router;

    if (state.matches.some(({ route }) => route.children)) {
      return {
        locations: [state.location],
        index: 0,
      };
    }

    return {
      locations: [],
      index: -1,
    };
  });

  useEffect(
    () =>
      router.subscribe((state) => {
        switch (state.historyAction) {
          case "POP": {
            setState(({ index, locations }) => {
              index = locations.findIndex((location) => location.key === state.location.key);

              return {
                locations,
                index,
              };
            });

            break;
          }

          case "PUSH": {
            setState(({ index, locations }) => {
              index += 1;

              locations.splice(index);
              locations.push(state.location);

              return {
                locations,
                index,
              };
            });

            break;
          }

          case "REPLACE": {
            setState(({ index, locations }) => {
              locations.splice(index, 1, state.location);

              return {
                locations,
                index,
              };
            });

            break;
          }
        }
      }),
    [],
  );

  return <Context.Provider value={state}>{props.children}</Context.Provider>;
}

export function useHistoryContext() {
  return useContext(Context);
}
