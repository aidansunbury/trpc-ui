import type { ZodEffectsDef } from "zod";
import { zodSelectorFunction } from "../../../input-mappers/zod/selector";
import type { ParseReferences, ParsedInputNode } from "../../../parseNodeTypes";

export function parseZodEffectsDef(
  def: ZodEffectsDef,
  refs: ParseReferences,
): ParsedInputNode {
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return zodSelectorFunction(def.schema._def, refs);
}
