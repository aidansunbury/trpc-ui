import type { ZodUndefinedDef } from "zod";
import type { ParseReferences, ParsedInputNode } from "../../../parseNodeTypes";
import { nodePropertiesFromRef } from "../../../utils";

export function parseZodUndefinedDef(
  def: ZodUndefinedDef,
  refs: ParseReferences,
): ParsedInputNode {
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return {
    type: "literal",
    value: undefined,
    ...nodePropertiesFromRef(refs),
  };
}
