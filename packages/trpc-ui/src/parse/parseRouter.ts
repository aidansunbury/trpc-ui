// import { type Router, isRouter } from "./routerType";

// import type { AnyTRPCRouter } from "@trpc/server";
import type { zodToJsonSchema } from "zod-to-json-schema";
// import { logParseError } from "./parseErrorLogs";
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

export type TrpcPanelExtraOptions = {
  logFailedProcedureParse?: boolean;
  transformer?: "superjson";
};
