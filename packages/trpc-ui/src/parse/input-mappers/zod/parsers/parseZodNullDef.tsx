import type {
  ParseReferences,
  ParsedInputNode,
} from "@src/parse/parseNodeTypes";
import { nodePropertiesFromRef } from "@src/parse/utils";
import type { ZodNullDef } from "zod";

export function parseZodNullDef(
  def: ZodNullDef,
  refs: ParseReferences,
): ParsedInputNode {
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return {
    type: "literal",
    value: null,
    ...nodePropertiesFromRef(refs),
  };
}
