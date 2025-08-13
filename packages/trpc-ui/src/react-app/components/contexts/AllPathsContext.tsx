import type { ParsedTRPCRouter, Procedure, Router } from "@src/parseV2/types";
import type { ColorSchemeType } from "@src/react-app/components/CollapsableSection";
import { colorSchemeForNode } from "@src/react-app/components/style-utils";
import React, { useContext } from "react";
import { type ReactNode, createContext, useMemo } from "react";

const Context = createContext<{
  pathsArray: string[];
  colorSchemeForNode: { [path: string]: ColorSchemeType };
} | null>(null);

function flatten(node: Router | Procedure): [string, ColorSchemeType][] {
  const r: [string, ColorSchemeType][] = [];
  const colorSchemeType = colorSchemeForNode(node);
  if (node.type === "router") {
    const o = Object.values(node.children)
      .map(flatten)
      // biome-ignore lint/performance/noAccumulatingSpread: <idk what this code is even doing>
      .reduce((a, b) => [...a, ...b]);
    return [...r, ...o, [node.path.join("."), colorSchemeType]];
  }

  return [...r, [node.path.join("."), colorSchemeType]];
}

export function AllPathsContextProvider({
  parsedRouter,
  children,
}: {
  parsedRouter: ParsedTRPCRouter;
  children: ReactNode;
}) {
  const flattened = useMemo(() => {
    const results: [string, ColorSchemeType][] = [];
    for (const node of Object.values(parsedRouter)) {
      results.push(...flatten(node));
    }
    return results;
  }, []);
  const pathsArray = useMemo(() => {
    return flattened.map((e) => e[0]);
  }, []);
  const colorSchemeForNode = useMemo(() => Object.fromEntries(flattened), []);
  return (
    <Context.Provider
      value={{
        pathsArray,
        colorSchemeForNode,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useAllPaths() {
  const ctx = useContext(Context);
  if (ctx === null) throw new Error("AllPathsContextProvider not found.");
  return ctx;
}
