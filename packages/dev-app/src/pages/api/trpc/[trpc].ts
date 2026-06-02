import { createNextApiHandler } from "@trpc/server/adapters/next";

// import { env } from "~/env.mjs";
import { appRouter } from "~/router";
import { createTRPCContext } from "~/server/api/trpc";

// export API handler
export default createNextApiHandler({
  createContext: createTRPCContext,
  onError:
    process.env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
          );
        }
      : undefined,
  router: appRouter,
});
