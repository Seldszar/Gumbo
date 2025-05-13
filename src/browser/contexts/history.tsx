import { ReactNode, createContext, useContext, useRef } from "react";
import { useLocation } from "react-router";

interface HistoryContext {
  defaultKey: string;
  defaultState: any;

  isDefaultLocation: boolean;
}

const Context = createContext<HistoryContext>({
  defaultKey: "default",
  defaultState: {},

  isDefaultLocation: false,
});

interface HistoryProviderProps {
  children: ReactNode;
}

export function HistoryProvider(props: HistoryProviderProps) {
  const location = useLocation();

  const defaultStateRef = useRef(location.state);
  const defaultKeyRef = useRef(location.key);

  const value = {
    get defaultKey() {
      return defaultKeyRef.current;
    },

    get defaultState() {
      return defaultStateRef.current;
    },

    get isDefaultLocation() {
      return this.defaultKey === location.key;
    },
  };

  return <Context.Provider {...props} value={value} />;
}

export function useHistoryContext() {
  return useContext(Context);
}
