import type { ZodVoidDef } from "zod";
import type { LiteralNode, ParseReferences } from "../../../parseNodeTypes";

export function parseZodVoidDef(
  _: ZodVoidDef,
  refs: ParseReferences,
): LiteralNode {
  return {
    path: refs.path,
    type: "literal",
    value: undefined,
  };
}
