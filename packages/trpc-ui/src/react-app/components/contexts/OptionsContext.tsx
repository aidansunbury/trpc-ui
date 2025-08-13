import type { ParsedTRPCRouter } from "@src/parseV2/types";
import type { RenderOptions } from "@src/render";
import React, { createContext, useContext, ReactNode } from "react";

// @ts-expect-error
const RenderOptionsContext = createContext<{
  options: RenderOptions;
  router: ParsedTRPCRouter;
}>(null);

interface RenderOptionsProviderProps {
  options: RenderOptions;
  router: ParsedTRPCRouter;
  children: ReactNode;
}

// TODO just make this a provider for everything
export const RenderOptionsProvider: React.FC<RenderOptionsProviderProps> = ({
  options,
  router,
  children,
}) => {
  // Provide the options as a readonly value (React context values are immutable by design)
  return (
    <RenderOptionsContext.Provider
      value={{
        options,
        router,
      }}
    >
      {children}
    </RenderOptionsContext.Provider>
  );
};

export const useRenderOptions = (): {
  options: RenderOptions;
  router: ParsedTRPCRouter;
} => {
  const context = useContext(RenderOptionsContext);

  if (context === null) {
    throw new Error(
      "useRenderOptions must be used within a RenderOptionsProvider",
    );
  }

  return context;
};
