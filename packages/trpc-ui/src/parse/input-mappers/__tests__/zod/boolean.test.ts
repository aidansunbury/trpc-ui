import { z } from "zod";
import type { BooleanNode } from "../../../parseNodeTypes";
import { defaultReferences } from "../../defaultReferences";
import { parseZodBooleanFieldDef } from "../../zod/parsers/parseZodBooleanFieldDef";

describe("Parse Zod Boolean", () => {
  it("should parse a zod boolean as a boolean node", () => {
    const expected: BooleanNode = {
      type: "boolean",
      path: [],
    };
    const schema = z.boolean();
    const parsed = parseZodBooleanFieldDef(schema._def, defaultReferences());
    expect(parsed).toStrictEqual(expected);
  });
});
