import type { AnyZodObject, ZodBrandedDef } from "zod";
import { zodSelectorFunction } from "../../../input-mappers/zod/selector";
import type { ParseReferences, ParsedInputNode } from "../../../parseNodeTypes";

export function parseZodBrandedDef(
  def: ZodBrandedDef<AnyZodObject>,
  refs: ParseReferences,
): ParsedInputNode {
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return zodSelectorFunction(def.type._def, refs);
}
