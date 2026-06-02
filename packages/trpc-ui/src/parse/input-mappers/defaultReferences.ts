import type { ParseReferences } from "@src/parse/parseNodeTypes";

export function defaultReferences(): ParseReferences {
  return {
    addDataFunctions: {
      addDescriptionIfExists: () => {},
    },
    options: {},
    path: [],
  };
}
