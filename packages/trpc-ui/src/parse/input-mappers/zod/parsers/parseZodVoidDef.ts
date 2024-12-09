import type { LiteralNode, ParseReferences } from "@src/parse/parseNodeTypes";
import type { ZodVoidDef } from "zod";

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
