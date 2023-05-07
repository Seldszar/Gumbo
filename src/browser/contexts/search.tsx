import { createContext, ReactNode, useContext, useEffect, useRef } from "react";
import { useSet } from "react-use";

type RefreshHandler = () => Promise<void>;

interface SearchContext {
  refreshHandlers: Set<RefreshHandler>;

  addRefreshHandler(handler: RefreshHandler): void;
  removeRefreshHandler(handler: RefreshHandler): void;
}

const Context = createContext({} as SearchContext);

interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider(props: SearchProviderProps) {
  const [refreshHandlers, { add, remove }] = useSet<RefreshHandler>();

  const context: SearchContext = {
    refreshHandlers,

    addRefreshHandler: add,
    removeRefreshHandler: remove,
  };

  return <Context.Provider value={context}>{props.children}</Context.Provider>;
}

export function useSearchContext() {
  return useContext(Context);
}

export function useRefreshHandler(handler: RefreshHandler) {
  const ref = useRef<RefreshHandler>();

  useEffect(() => {
    ref.current = handler;
  });

  const { addRefreshHandler, removeRefreshHandler } = useSearchContext();

  useEffect(() => {
    const callback = async () => {
      if (ref.current == null) {
        return;
      }

      return ref.current();
    };

    addRefreshHandler(callback);

    return () => {
      removeRefreshHandler(callback);
    };
  }, []);
}
