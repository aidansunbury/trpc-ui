import type { RenderOptions } from "@src/render";
import React, { createContext, useContext, ReactNode } from "react";

// @ts-expect-error
const RenderOptionsContext = createContext<RenderOptions>(null);

interface RenderOptionsProviderProps {
  options: RenderOptions;
  children: ReactNode;
}

export const RenderOptionsProvider: React.FC<RenderOptionsProviderProps> = ({
  options,
  children,
}) => {
  // Provide the options as a readonly value (React context values are immutable by design)
  return (
    <RenderOptionsContext.Provider value={options}>
      {children}
    </RenderOptionsContext.Provider>
  );
};

export const useRenderOptions = (): RenderOptions => {
  const context = useContext(RenderOptionsContext);

  if (context === null) {
    throw new Error(
      "useRenderOptions must be used within a RenderOptionsProvider",
    );
  }

  return context;
};
