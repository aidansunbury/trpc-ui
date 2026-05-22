import type { ZodNumberDef } from "zod";
import type { NumberNode, ParseFunction } from "../../../parseNodeTypes";
import { nodePropertiesFromRef } from "../../../utils";

export const parseZodNumberDef: ParseFunction<ZodNumberDef, NumberNode> = (
  def,
  refs,
) => {
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return {
    type: "number",
    ...nodePropertiesFromRef(refs),
  };
};
