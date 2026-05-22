import type { ZodNullDef } from "zod";
import type { ParseReferences, ParsedInputNode } from "../../../parseNodeTypes";
import { nodePropertiesFromRef } from "../../../utils";

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
