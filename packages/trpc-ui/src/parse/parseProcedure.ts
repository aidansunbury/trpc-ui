import type { ParsedInputNode } from "./parseNodeTypes";
import type { JSON7SchemaType, ProcedureType } from "./parseRouter";

export type ProcedureExtraData = {
  parameterDescriptions: { [path: string]: string };
  description?: string;
};

export type ParsedProcedure = {
  inputSchema: JSON7SchemaType;
  node: ParsedInputNode;
  nodeType: "procedure";
  procedureType: ProcedureType;
  pathFromRootRouter: string[];
  extraData: ProcedureExtraData;
};
