import { HeadersPopup } from "@src/react-app/components/HeadersPopup";
import { SearchOverlay } from "@src/react-app/components/SearchInputOverlay";
import { AllPathsContextProvider } from "@src/react-app/components/contexts/AllPathsContext";
import {
  HeadersContextProvider,
  useHeaders,
} from "@src/react-app/components/contexts/HeadersContext";
import { HotKeysContextProvider } from "@src/react-app/components/contexts/HotKeysContext";
import { SiteNavigationContextProvider } from "@src/react-app/components/contexts/SiteNavigationContext";
import { useSiteNavigationContext } from "@src/react-app/components/contexts/SiteNavigationContext";
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
import { trpc } from "./trpc";

export function RootComponent({
  rootRouter,
  options,
  trpc,
}: {
  rootRouter: ParsedRouter;
  options: RenderOptions;
  trpc: ReturnType<typeof createTRPCReact>;
}) {
  return (
    <NuqsAdapter>
      <HeadersContextProvider>
        <AllPathsContextProvider rootRouter={rootRouter}>
          <SiteNavigationContextProvider>
            <ClientProviders trpc={trpc} options={options}>
              <HotKeysContextProvider>
                <SearchOverlay>
                  <div className="relative flex h-full w-full flex-1 flex-col">
                    <AppInnards rootRouter={rootRouter} options={options} />
                  </div>
                </SearchOverlay>
              </HotKeysContextProvider>
            </ClientProviders>
          </SiteNavigationContextProvider>
        </AllPathsContextProvider>
      </HeadersContextProvider>
    </NuqsAdapter>
  );
}

function ClientProviders({
  trpc,
  children,
  options,
}: {
  trpc: ReturnType<typeof createTRPCReact>;
  children: ReactNode;
  options: RenderOptions;
}) {
  const headers = useHeaders();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: options.url,
          headers: headers.getHeaders,
        }),
      ],
      transformer: (() => {
        if (options.transformer === "superjson") return superjson;
        return undefined;
      })(),
    }),
  );
  const [queryClient] = useState(() => new QueryClient());

  return (
    <trpc.Provider queryClient={queryClient} client={trpcClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function AppInnards({
  rootRouter,
  options,
}: {
  rootRouter: ParsedRouter;
  options: RenderOptions;
}) {
  const [sidebarOpen, setSidebarOpen] = useLocalStorage(
    "trpc-panel.show-minimap",
    true,
  );
  const { openAndNavigateTo } = useSiteNavigationContext();

  const [path] = useQueryState("path", parseAsArrayOf(parseAsString, "."));

  useEffect(() => {
    openAndNavigateTo(path ?? [], true);
  }, []);

  const utils = trpc.useUtils();

  return (
    <div className="relative flex flex-1 flex-col">
      <TopBar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex flex-1 flex-row bg-mainBackground">
        <SideNav
          rootRouter={rootRouter}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />
        <div
          className="flex flex-1 flex-col items-center overflow-scroll"
          style={{
            maxHeight: "calc(100vh - 4rem)",
          }}
        >
          <div className="container max-w-6xl p-4 pt-8">
            <MetaHeader meta={options.meta} />
            <RouterContainer router={rootRouter} options={options} />
          </div>
        </div>
      </div>
      <HeadersPopup />
      <Toaster />
    </div>
  );
}
