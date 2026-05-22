import type { ZodVoidDef } from "zod";
import type { LiteralNode, ParseReferences } from "../../../parseNodeTypes";

export function parseZodVoidDef(
  _: ZodVoidDef,
  refs: ParseReferences,
): LiteralNode {
  return {
    type: "literal",
    value: undefined,
    path: refs.path,
  };
}
