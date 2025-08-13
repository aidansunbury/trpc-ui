import type { JSONSchema7Object } from "json-schema";

/**
 * Type representing the validator types supported by the parser
 */
export type ValidatorType = "zod" | "valibot" | "arktype" | "unknown" | "mixed";

/**
 * Base type for common properties shared by routers and procedures
 */
export type BaseNodeType = {
  path: string[];
};

/**
 * Type representing metadata that can be attached to a procedure
 */
export type ProcedureMeta = Record<string, string>;

/**
 * Type representing any procedure (query or mutation)
 */
export type Procedure = BaseNodeType & {
  type: "mutation" | "query";
  meta: ProcedureMeta;
  validator: ValidatorType;
  schema?: JSONSchema7Object;
};

/**
 * Type for a tRPC router
 */
export type Router = BaseNodeType & {
  type: "router";
  children: ParsedTRPCRouter;
};

export type RouterOrProcedure = Router | Procedure;

/**
 * Type representing the output of the parseTRPCRouter function
 */
// TODO rename this to children
export type ParsedTRPCRouter = Record<string, Router | Procedure>;
