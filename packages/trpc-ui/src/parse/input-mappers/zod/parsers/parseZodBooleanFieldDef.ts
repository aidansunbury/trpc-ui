import type { ZodBooleanDef } from "zod";
import type { BooleanNode, ParseFunction } from "../../../parseNodeTypes";
import { nodePropertiesFromRef } from "../../../utils";

export const parseZodBooleanFieldDef: ParseFunction<
  ZodBooleanDef,
  BooleanNode
> = (def, refs) => {
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return { type: "boolean", ...nodePropertiesFromRef(refs) };
};
