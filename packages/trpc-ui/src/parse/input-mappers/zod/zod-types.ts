import type { ZodFirstPartyTypeKind, ZodTypeDef } from "zod";

export type ZodDefWithType = ZodTypeDef & { typeName: ZodFirstPartyTypeKind };
