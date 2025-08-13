import { useAllPaths } from "@src/react-app/components/contexts/AllPathsContext";
import React, {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useRef,
} from "react";
import { type StoreApi, type UseBoundStore, create } from "zustand";

type CollapsibleState = Record<string, boolean>;
type CollapsibleStore = UseBoundStore<StoreApi<CollapsibleState>>;

const Context = createContext<{
  scrollToPathIfMatches: (path: string[], element: Element) => boolean;
  markForScrollTo: (path: string[]) => void;
  openAndNavigateTo: (path: string[], closeOthers?: boolean) => void;
} | null>(null);

function forAllPaths(path: string[], callback: (current: string) => void) {
  const cur: string[] = [];
  for (const next of path) {
    cur.push(next);
    const joined = cur.join(".");
    callback(joined);
  }
}

let collapsablesStore: CollapsibleStore;

function createCollapsablesStore(allPaths: string[]): CollapsibleStore {
  const initialState: CollapsibleState = {};
  for (const path of allPaths) {
    initialState[path] = false;
  }
  return create<CollapsibleState>(() => initialState);
}

function initCollapsablesStore(allPaths: string[]) {
  if (!collapsablesStore) {
    collapsablesStore = createCollapsablesStore(allPaths);
  }
}

export const collapsables = (() => {
  const hide = (path: string[]) => {
    if (!collapsablesStore) return;
    const pathJoined = path.join(".");
    forAllPaths(path, (current) => {
      if (pathJoined.length <= current.length) {
        collapsablesStore.setState({
          [current]: false,
        });
      }
    });
  };
  const show = (path: string[]) => {
    if (!collapsablesStore) return;
    forAllPaths(path, (current) => {
      collapsablesStore.setState({
        [current]: true,
      });
    });
  };
  return {
    hide,
    show,
    toggle(path: string[]) {
      if (!collapsablesStore) return;
      const state = collapsablesStore.getState();
      if (state[path.join(".")]) {
        hide(path);
      } else {
        show(path);
      }
    },
    hideAll() {
      if (!collapsablesStore) return;
      const state = collapsablesStore.getState();
      const newValue: CollapsibleState = {};
      for (const pathKey in state) {
        newValue[pathKey] = false;
      }
      collapsablesStore.setState(newValue);
    },
  };
})();

export function useCollapsableIsShowing(path: string[]): boolean {
  const pathKey = useMemo(() => path.join("."), [path]);
  if (!collapsablesStore) {
    return false;
  }
  return collapsablesStore((state) => state[pathKey] ?? false);
}

export function SiteNavigationContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const allPaths = useAllPaths();
  initCollapsablesStore(allPaths.pathsArray);

  const scrollToPathRef = useRef<string[] | null>(null);

  function scrollToPathIfMatches(path: string[], element: Element) {
    if (
      !scrollToPathRef.current ||
      path.join(".") !== scrollToPathRef.current.join(".")
    ) {
      return false;
    }

    scrollToPathRef.current = null;
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
    return true;
  }

  function markForScrollTo(path: string[]) {
    scrollToPathRef.current = path;
  }

  function openAndNavigateTo(path: string[], hideOthers?: boolean) {
    if (hideOthers) {
      collapsables.hideAll();
    }
    collapsables.show(path);
    markForScrollTo(path);
  }

  return (
    <Context.Provider
      value={{
        scrollToPathIfMatches,
        markForScrollTo,
        openAndNavigateTo,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useSiteNavigationContext() {
  const context = useContext(Context);
  if (context === null)
    throw new Error(
      "useCollapsableContext must be called from within a CollapsableContext",
    );
  return context;
}
