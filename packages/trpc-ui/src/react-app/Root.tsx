import type { ParsedTRPCRouter } from "@src/parseV2/types";
import { HeadersPopup } from "@src/react-app/components/HeadersPopup";
import { SearchOverlay } from "@src/react-app/components/SearchInputOverlay";
import {
  AllPathsContextProvider,
  useAllPaths,
} from "@src/react-app/components/contexts/AllPathsContext";
import {
  HeadersContextProvider,
  useHeaders,
} from "@src/react-app/components/contexts/HeadersContext";
import { HotKeysContextProvider } from "@src/react-app/components/contexts/HotKeysContext";
import {
  SiteNavigationContextProvider,
  useSiteNavigationContext,
} from "@src/react-app/components/contexts/SiteNavigationContext";

import { useLocalStorage } from "@src/react-app/components/hooks/useLocalStorage";
import type { RenderOptions } from "@src/render";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type createTRPCReact, httpBatchLink } from "@trpc/react-query";
import { useQueryState } from "nuqs";
import { parseAsArrayOf, parseAsString } from "nuqs";
import { NuqsAdapter } from "nuqs/adapters/react";
import React, { type ReactNode, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import superjson from "superjson";
import type { ParsedRouter } from "../parse/parseRouter";
import { MetaHeader } from "./components/MetaHeader";
import { RouterContainer } from "./components/RouterContainer";
import { SideNav } from "./components/SideNav";
import { TopBar } from "./components/TopBar";
import {
  RenderOptionsProvider,
  useRenderOptions,
} from "./components/contexts/OptionsContext";
import { Container } from "./v2/Container";

export function RootComponent({
  parsedRouter,
  options,
}: {
  parsedRouter: ParsedTRPCRouter; //* The new one
  options: RenderOptions;
}) {
  return (
    <NuqsAdapter>
      <HeadersContextProvider>
        <AllPathsContextProvider parsedRouter={parsedRouter}>
          <SiteNavigationContextProvider>
            <HotKeysContextProvider>
              <RenderOptionsProvider options={options} router={parsedRouter}>
                <SearchOverlay>
                  <div className="relative flex h-full w-full flex-1 flex-col">
                    <AppInnards options={options} parsedRouter={parsedRouter} />
                  </div>
                </SearchOverlay>
              </RenderOptionsProvider>
            </HotKeysContextProvider>
          </SiteNavigationContextProvider>
        </AllPathsContextProvider>
      </HeadersContextProvider>
    </NuqsAdapter>
  );
}

function AppInnards({
  options,
  parsedRouter,
}: {
  parsedRouter: ParsedTRPCRouter;
  options: RenderOptions;
}) {
  const { router } = useRenderOptions();

  const [sidebarOpen, setSidebarOpen] = useLocalStorage(
    "trpc-panel.show-minimap",
    true,
  );
  const { openAndNavigateTo } = useSiteNavigationContext();

  const [path] = useQueryState("path", parseAsArrayOf(parseAsString, "."));

  useEffect(() => {
    openAndNavigateTo(path ?? [], true);
  }, []);
  const allPaths = useAllPaths();

  return (
    <div className="relative flex flex-1 flex-col">
      <TopBar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex flex-1 flex-row bg-mainBackground">
        <SideNav
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          parsedRoouter={parsedRouter}
        />
        <div
          className="flex flex-1 flex-col items-center overflow-scroll"
          style={{
            maxHeight: "calc(100vh - 4rem)",
          }}
        >
          <div className="container max-w-6xl p-4 pt-8">
            <MetaHeader meta={options.meta} />
            <pre>{JSON.stringify(allPaths, null, 2)}</pre>
            {/* <RouterContainer router={rootRouter} options={options} /> */}
            {/* <pre>{JSON.stringify(router, null, 2)}</pre> */}
            {Object.entries(router).map(([key, routerOrProcedure]) => {
              return <Container item={routerOrProcedure} key={key} />;
            })}
          </div>
        </div>
      </div>
      <HeadersPopup />
      <Toaster />
    </div>
  );
}
