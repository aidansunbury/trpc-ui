import { toJsonSchema } from "@valibot/to-json-schema";
import { type } from "arktype";
import type { JSONSchema7Type } from "json-schema";
import * as v from "valibot";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { appRouter } from "./router";

const index = 0;

appRouter.postsRouter.createPost;

function parseNode(node: any) {
  return node._def;
}

const base = type({});

const array = [
  type({
    text1: "string >=1",
  }),
  type({
    text2: "string >=1",
  }),
];

array.reduce((acc, curr) => {
  return acc.and(curr);
});

const ark = type({
  text: "string >=1",
}).and(
  type({
    text1: "string",
  }),
);

const vali = v.object({
  text: v.pipe(v.string(), v.minLength(1)),
  nested: v.object({
    nestedText: v.string(),
  }),
});

const schemaOne = z.object({
  prop1: z.string(),
});

const schemaTwo = z.object({
  prop2: z.number(),
});

const combined = schemaOne.merge(schemaTwo);

const res = zodToJsonSchema(combined);

const expected = z.object({
  text: z.string().min(1),
  nested: z.object({
    nestedText: z.string(),
  }),
});

expected["~standard"].vendor;

// const jsonSchema = zodToJsonSchema(
//   appRouter.postsRouter.createPost._def.inputs[0]
// );

// console.dir(appRouter.postsRouter.createPost._def.inputs.length);

// console.dir(jsonSchema, {
//   depth: null,
// });

// console.dir(ark.toJsonSchema(), {
//   depth: null,
// });

// console.dir(zodToJsonSchema(expected), {
//   depth: null,
// });

// console.dir(toJsonSchema(vali));

// console.dir(appRouter._def, {
//   depth: null,
// });

// console.dir(appRouter.postsRouter.createPost._def, {
//   depth: null,
// });

// console.dir(appRouter.postsRouter.deep.coolQuery._def, {
//   depth: null,
// });

function detectValidatorType(
  validator: any,
): "zod" | "valibot" | "arktype" | "unknown" {
  // Handle null or undefined
  if (validator == null) {
    return "unknown";
  }

  // First attempt: Check for standard schema vendor property
  try {
    if (validator["~standard"]?.vendor) {
      const vendor = validator["~standard"].vendor.toLowerCase();
      if (vendor.includes("zod")) return "zod";
      if (vendor.includes("valibot")) return "valibot";
      if (vendor.includes("arktype")) return "arktype";
    }
  } catch (e) {
    // Ignore errors when accessing properties
  }
  console.log("unable to determine based on standard schema");

  // Second attempt: Use heuristics based on library-specific properties

  // Check for Zod
  // Zod schemas have specific properties like _def, safeParse, parse, and ZodType

  if (
    validator._def !== undefined &&
    typeof validator.safeParse === "function" &&
    typeof validator.parse === "function" &&
    validator instanceof Object.getPrototypeOf(validator).constructor &&
    (Object.getPrototypeOf(validator).constructor.name.includes("Zod") ||
      validator.constructor.name.includes("Zod"))
  ) {
    return "zod";
  }

  // Check for Valibot
  // Valibot validators have specific structure with _type, _schema, and _parse properties
  if (
    validator._type !== undefined &&
    (validator._schema !== undefined || validator._expected !== undefined) &&
    typeof validator._parse === "function"
  ) {
    return "valibot";
  }

  // Check for Arktype
  // Arktype types have specific properties like infer, type, as, and schema
  if (
    typeof validator.infer === "function" &&
    validator.type !== undefined &&
    typeof validator.as === "function" &&
    validator.schema !== undefined
  ) {
    return "arktype";
  }

  // Unknown validator type
  return "unknown";
}

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
export type ProcedureMeta = Record<string, any>;

/**
 * Type representing any procedure (query or mutation)
 */
export type Procedure = BaseNodeType & {
  type: "mutation" | "query";
  meta: ProcedureMeta;
  validator: ValidatorType;
  schema?: JSONSchema7Type;
};

/**
 * Type for a tRPC router
 */
export type Router = BaseNodeType & {
  type: "router";
  children: RouterStructure;
};

/**
 * Type representing the entire router structure
 * A dictionary where keys are router/procedure names and values are the corresponding structures
 */
export type RouterStructure = Record<string, Router | Procedure>;

/**
 * Type representing the output of the parseTRPCRouter function
 */
export type ParsedTRPCRouter = RouterStructure;

/**
 * Recursively parses a tRPC router structure and its sub-routers
 *
 * @param router - The router or procedure to parse
 * @param currentPath - The current path in the router hierarchy
 * @param detectValidatorFn - Function to detect the type of validator
 * @param zodToJsonSchemaFn - Function to convert Zod schema to JSON Schema (optional)
 * @returns A structured representation of the router hierarchy
 */
function parseTRPCRouter(
  router: any,
  currentPath: string[] = [],
  detectValidatorFn: (
    validator: any,
  ) => "zod" | "valibot" | "arktype" | "unknown" | "mixed" = () => "unknown",
): ParsedTRPCRouter {
  // The result object we'll build up
  const result: Record<string, any> = {};

  // Iterate over each key in the router
  for (const key in router) {
    const item = router[key];

    // Skip all internal properties (starting with _)
    if (key.startsWith("_")) {
      continue;
    }

    // Create the path for this node
    const nodePath = [...currentPath, key];

    // Check if it's a procedure (query or mutation)
    if (item?._def?.type) {
      const meta = item._def.meta || {};

      // Determine validator type
      let validatorType: "zod" | "valibot" | "arktype" | "unknown" | "mixed" =
        "unknown";
      let jsonSchema: any = undefined;

      // Check if inputs array exists and has elements
      if (
        item._def.inputs &&
        Array.isArray(item._def.inputs) &&
        item._def.inputs.length > 0
      ) {
        // Get validator type of first input
        const firstType = detectValidatorFn(item._def.inputs[0]);

        // Check if all inputs are of the same type
        const allSameType = item._def.inputs.every(
          (input) => detectValidatorFn(input) === firstType,
        );

        validatorType = allSameType ? firstType : "mixed";

        // Generate JSON Schema for Zod validators
        if (validatorType === "zod") {
          try {
            // Merge all Zod schemas
            let mergedSchema = item._def.inputs[0];

            for (let i = 1; i < item._def.inputs.length; i++) {
              if (typeof mergedSchema.merge === "function") {
                mergedSchema = mergedSchema.merge(item._def.inputs[i]);
              }
            }

            // Convert merged schema to JSON Schema
            jsonSchema = zodToJsonSchema(mergedSchema);
          } catch (error) {
            // If merging or conversion fails, leave jsonSchema as undefined
            console.error("Error generating JSON Schema:", error);
          }
        } else if (validatorType === "valibot") {
          try {
            const merged = v.intersect(item._def.inputs);
            jsonSchema = toJsonSchema(merged);
          } catch (error) {
            // If merging or conversion fails, leave jsonSchema as undefined
            console.error("Error generating JSON Schema:", error);
          }
        } else if (validatorType === "arktype") {
          const merged = item._def.inputs.reduce((merge, curr) => {
            merge.and(curr);
          });
          jsonSchema = merged.toJsonSchema();
        }
      }

      if (item._def.type === "query") {
        result[key] = {
          type: "query",
          path: nodePath,
          meta,
          validator: validatorType,
          schema: jsonSchema,
        };
      } else if (item._def.type === "mutation") {
        result[key] = {
          type: "mutation",
          path: nodePath,
          meta,
          validator: validatorType,
          schema: jsonSchema,
        };
      }
    }
    // Check if it's a router (contains other procedures or routers)
    else if (item && typeof item === "object" && !Array.isArray(item)) {
      // Recursively parse potential router
      const children = parseTRPCRouter(item, nodePath, detectValidatorFn);

      // Only add it as a router if it has children
      if (Object.keys(children).length > 0) {
        result[key] = {
          type: "router",
          path: nodePath,
          children,
        };
      }
    }
  }

  return result;
}

console.dir(
  JSON.stringify(parseTRPCRouter(appRouter, [], detectValidatorType)),
  {
    depth: null,
  },
);

// console.log(detectValidatorType(ark));
