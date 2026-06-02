import type { ZodNullableDef } from "zod";
import { zodSelectorFunction } from "../../../input-mappers/zod/selector";
import type { ParsedInputNode, ParseReferences } from "../../../parseNodeTypes";

export function parseZodNullableDef(
  def: ZodNullableDef,
  refs: ParseReferences,
): ParsedInputNode {
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return zodSelectorFunction(def.innerType._def, refs);
}
