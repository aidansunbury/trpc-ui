import { nodePropertiesFromRef } from "@src/parse/utils";
import type { ZodBooleanDef } from "zod";
import type { BooleanNode, ParseFunction } from "../../../parseNodeTypes";

export const parseZodBooleanFieldDef: ParseFunction<
  ZodBooleanDef,
  BooleanNode
> = (def, refs) => {
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return { type: "boolean", ...nodePropertiesFromRef(refs) };
};
