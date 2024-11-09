import { createTRPCReact } from "@trpc/react-query";
import type { AnyTRPCRouter } from "@trpc/server";
// TODO add type safety here
// don't try this at home
export const trpc = createTRPCReact<AnyTRPCRouter>();
