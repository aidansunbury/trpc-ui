import fs from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { AnyTRPCRouter } from "@trpc/server";
import { type TrpcPanelExtraOptions } from "./parse/parseRouter";

import { parseTRPCRouter } from "./parseV2/parse";
export type Info = {
  title?: string;
  description?: string;
};

export type RenderOptions = {
  url: string;
  cache?: boolean;
  meta?: Info;
} & TrpcPanelExtraOptions;

const defaultParseRouterOptions: Partial<TrpcPanelExtraOptions> = {
  logFailedProcedureParse: true,
  transformer: "superjson",
};

const dirLocation = dirname(fileURLToPath(import.meta.url));
const javascriptReplaceSymbol = "{{js}}";
const cssReplaceSymbol = "{{css}}";
const routerReplaceSymbol = '"{{parsed_router}}"';
const optionsReplaceSymbol = '"{{options}}"';
const bundlePath = `${dirLocation}/react-app/bundle.js`;
const indexPath = `${dirLocation}/react-app/index.html`;
const cssPath = `${dirLocation}/react-app/index.css`;
const bundleJs = fs.readFileSync(bundlePath).toString();
const indexHtml = fs.readFileSync(indexPath).toString();
const indexCss = fs.readFileSync(cssPath).toString();

type InjectionParam = {
  searchFor: string;
  injectString: string;
};

function injectParams(string: string, injectionParams: InjectionParam[]) {
  let r = string;
  for (const param of injectionParams) {
    r = injectInString(param.searchFor, r, param.injectString);
  }
  return r;
}

function injectInString(
  searchFor: string,
  string: string,
  injectString: string,
) {
  const startIndex = string.indexOf(searchFor);
  return (
    string.slice(0, startIndex) +
    injectString +
    string.slice(startIndex + searchFor.length)
  );
}

// renders value should never change unless the server is restarted, just parse and inject once
const cache: {
  val: string | null;
} = {
  val: null,
};

// TODO: changing this from AnyTRPCRouter to a generic type would probably improve type safety
export function renderTrpcPanel(router: AnyTRPCRouter, options: RenderOptions) {
  if (options.cache === true && cache.val) return cache.val;

  const bundleInjectionParams: InjectionParam[] = [
    {
      searchFor: routerReplaceSymbol,
      injectString: JSON.stringify(parseTRPCRouter(router)),
    },
    {
      searchFor: optionsReplaceSymbol,
      injectString: JSON.stringify(options),
    },
  ];
  const bundleInjected = injectParams(bundleJs, bundleInjectionParams);
  const script = `<script>${bundleInjected}</script>`;
  const css = `<style>${indexCss}</style>`;
  const htmlReplaceParams: InjectionParam[] = [
    {
      searchFor: javascriptReplaceSymbol,
      injectString: script,
    },
    {
      searchFor: cssReplaceSymbol,
      injectString: css,
    },
  ];
  cache.val = injectParams(indexHtml, htmlReplaceParams);
  return cache.val;
}
