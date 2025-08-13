import type { ValidatorType } from "./types";

export function detectValidatorType(validator: any): ValidatorType {
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
