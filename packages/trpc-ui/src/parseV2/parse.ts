import { toJsonSchema } from "@valibot/to-json-schema";
import type { Type as ArkTypeValidator } from "arktype";
import type { JSONSchema7Object } from "json-schema";
import * as v from "valibot";
import { zodToJsonSchema } from "zod-to-json-schema";
import * as z3 from "zod/v3";
import * as z4 from "zod/v4";
import { detectValidatorType } from "./detectValidator";
import type { ParsedTRPCRouter, Router } from "./types";

export function parseRootRouter(router: any): Router {
  return parseTRPCRouter(router, []) as unknown as Router;
}

/**
 * Recursively parses a tRPC router structure and its sub-routers
 *
 * @param router - The router or procedure to parse
 * @param currentPath - The current path in the router hierarchy
 * @param detectValidatorFn - Function to detect the type of validator
 * @param zodToJsonSchemaFn - Function to convert Zod schema to JSON Schema (optional)
 * @returns A structured representation of the router hierarchy
 */
export function parseTRPCRouter(
  router: any,
  currentPath: string[] = [],
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
        const firstType = detectValidatorType(item._def.inputs[0]);

        // Check if all inputs are of the same type
        const allSameType = item._def.inputs.every(
          (input: any) => detectValidatorType(input) === firstType,
        );

        validatorType = allSameType ? firstType : "mixed";

        // Generate JSON Schema for Zod validators
        if (validatorType === "zod") {
          try {
            // Merge all Zod schemas
            let mergedSchema = item._def.inputs[0];

            for (let i = 1; i < item._def.inputs.length; i++) {
              if (typeof mergedSchema.extend === "function") {
                mergedSchema = mergedSchema.extend(item._def.inputs[i].shape);
              }
            }

            //* This works, but the merging is not working
            // jsonSchema = zodToJsonSchema(mergedSchema);

            if ("_zod" in mergedSchema) {
              jsonSchema = z4.toJSONSchema(mergedSchema, {
                target: "draft-7",
                unrepresentable: "any",
              });
            } else {
              jsonSchema = zodToJsonSchema(mergedSchema);
            }
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
          console.log("arktype");
          console.log(item._def.inputs);
          jsonSchema = arkToJson(item._def.inputs);
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
      const children = parseTRPCRouter(item, nodePath);

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

function arkToJson(inputs: ArkTypeValidator[]): JSONSchema7Object {
  if (inputs.length === 1) {
    return inputs[0]?.toJsonSchema();
  }
  if (inputs.length > 1) {
    const [first, ...rest] = inputs;
    return arkRecursive(first, rest);
  }
  return {};
}
function arkRecursive(
  base: ArkTypeValidator,
  rest: ArkTypeValidator[],
): JSONSchema7Object {
  if (rest.length === 0) {
    return base.toJsonSchema();
  }
  const [first, ...left] = rest;
  return arkRecursive(base.and(first), left);
}
