import { nodePropertiesFromRef } from "@src/parse/utils";
import type { ZodArrayDef } from "zod";
import type { ArrayNode, ParseFunction } from "../../../parseNodeTypes";
import { zodSelectorFunction } from "../selector";

export const parseZodArrayDef: ParseFunction<ZodArrayDef, ArrayNode> = (
  def,
  refs,
) => {
  const { type } = def;
  const childType = zodSelectorFunction(type._def, { ...refs, path: [] });
  refs.addDataFunctions.addDescriptionIfExists(def, refs);
  return {
    type: "array",
    childType,
    ...nodePropertiesFromRef(refs),
  };
};
