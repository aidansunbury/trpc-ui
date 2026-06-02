import type { ZodPromiseDef } from "zod";
import { zodSelectorFunction } from "../../../input-mappers/zod/selector";
import type { ParsedInputNode, ParseReferences } from "../../../parseNodeTypes";

export function parseZodPromiseDef(
  def: ZodPromiseDef,
  refs: ParseReferences,
): ParsedInputNode {
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return zodSelectorFunction(def.type._def, refs);
}
