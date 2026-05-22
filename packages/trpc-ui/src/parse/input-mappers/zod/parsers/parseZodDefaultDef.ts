import type { ZodDefaultDef } from "zod";
import { zodSelectorFunction } from "../../../input-mappers/zod/selector";
import type { ParseReferences, ParsedInputNode } from "../../../parseNodeTypes";

export function parseZodDefaultDef(
  def: ZodDefaultDef,
  refs: ParseReferences,
): ParsedInputNode {
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return zodSelectorFunction(def.innerType._def, refs);
}
