import { type Router, isProcedure, isRouter } from "./routerType";

import type { AnyTRPCRouter } from "@trpc/server";
import type { zodToJsonSchema } from "zod-to-json-schema";
import { logParseError } from "./parseErrorLogs";
import { type ParsedProcedure } from "./parseProcedure";

// TODO this should be more specific, as it hurts the type safety lower down
export type JSON7SchemaType = ReturnType<typeof zodToJsonSchema>;

export type ProcedureType = "query" | "mutation" | "subscription";

export type ParsedRouterChildren = {
  [key: string]: ParsedRouter | ParsedProcedure;
};

export type ParsedRouter = {
  children: ParsedRouterChildren;
  path: string[];
  nodeType: "router";
};

export type ParseRouterRefs = {
  path: string[];
};

// Some things in the router are not procedures, these are those things keys
const skipSet = new Set(["createCaller", "_def", "getErrorShape"]);

function parseRouter(
  router: Router,
  routerPath: string[],
  options: TrpcPanelExtraOptions,
): ParsedRouter {
  const children: ParsedRouterChildren = {};
  let hasChild = false;
  // .procedures contains procedures and routers
  for (const [procedureOrRouterPath, child] of Object.entries(router)) {
    if (skipSet.has(procedureOrRouterPath)) continue;
    const newPath = routerPath.concat([procedureOrRouterPath]);
    const parsedNode = (() => {
      if (isRouter(child)) {
        return parseRouter(child, newPath, options);
      }
      // if (isProcedure(child)) {
      //   return parseProcedure(child, newPath, options);
      // }
      return null;
    })();
    if (!parsedNode) {
      logParseError(newPath.join("."), "Couldn't parse node.");
      continue;
    }
    hasChild = true;
    children[procedureOrRouterPath] = parsedNode;
  }
  if (!hasChild)
    logParseError(
      routerPath.join("."),
      `Router doesn't have any successfully parsed children.`,
    );
  return { children, nodeType: "router", path: routerPath };
}

export type TrpcPanelExtraOptions = {
  logFailedProcedureParse?: boolean;
  transformer?: "superjson";
};

function parseRouterWithOptions(
  router: AnyTRPCRouter,
  parseRouterOptions: TrpcPanelExtraOptions,
) {
  if (!isRouter(router)) {
    throw new Error("Non trpc router passed to trpc panel.");
  }
  return parseRouter(router, [], parseRouterOptions);
}
