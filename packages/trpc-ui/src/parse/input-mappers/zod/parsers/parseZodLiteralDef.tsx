import { nodePropertiesFromRef } from "@src/parse/utils";
import type { ZodLiteralDef } from "zod";
import type { LiteralNode, ParseFunction } from "../../../parseNodeTypes";

export const parseZodLiteralDef: ParseFunction<ZodLiteralDef, LiteralNode> = (
  def,
  refs,
) => {
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return {
    type: "literal",
    value: def.value,
    ...nodePropertiesFromRef(refs),
  };
};
