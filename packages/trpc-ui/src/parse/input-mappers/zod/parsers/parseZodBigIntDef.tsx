import type {
  ParseReferences,
  ParsedInputNode,
} from "@src/parse/parseNodeTypes";
import { nodePropertiesFromRef } from "@src/parse/utils";
import type { ZodBigIntDef } from "zod";

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
