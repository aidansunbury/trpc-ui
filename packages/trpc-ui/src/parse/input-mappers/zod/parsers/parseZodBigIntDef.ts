import type { ZodBigIntDef } from "zod";
import type { ParseReferences, ParsedInputNode } from "../../../parseNodeTypes";
import { nodePropertiesFromRef } from "../../../utils";

export function parseZodBigIntDef(
  def: ZodBigIntDef,
  refs: ParseReferences,
): ParsedInputNode {
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return {
    type: "number",
    ...nodePropertiesFromRef(refs),
  };
}
