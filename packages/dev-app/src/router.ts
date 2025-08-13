import { TRPCError } from "@trpc/server";
import { type } from "arktype";
import * as v from "valibot";
import * as z3 from "zod/v3";
import * as z4 from "zod/v4";
import { createTRPCRouter, procedure } from "~/server/api/trpc";

const zod3Middleware = procedure
  .input(
    z3.object({
      needString: z3.string(),
    }),
  )
  .use(({ ctx, next }) => {
    return next({ ctx });
  });

const zod4Middleware = procedure
  .input(
    z4.object({
      needString: z4.string(),
    }),
  )
  .use(({ ctx, next }) => {
    return next({ ctx });
  });

const arktypeVal = procedure
  .input(
    type({
      name: "string",
    }),
  )
  .use(({ ctx, next }) => {
    return next({ ctx });
  });

const valibotMiddleware = procedure
  .input(v.object({ middlewareProp: v.string() }))
  .use(({ ctx, next }) => {
    return next({ ctx });
  });

const deepRouter = createTRPCRouter({
  coolQuery: procedure
    .input(
      z3.object({
        needString: z3.string(),
      }),
    )
    .query(({ input }) => ({
      data: "thing",
    })),
});

const anotherRouter = createTRPCRouter({
  coolQuery2: procedure
    .input(
      z3.object({
        hi: z3.number(),
      }),
    )
    .query(() => ({
      data: "thing",
    })),
});

const postsRouter = createTRPCRouter({
  getAllPosts: procedure
    .meta({
      description: "Simple procedure that returns a list of posts",
    })
    .query(() => {
      return [
        {
          id: "asodifjaosdf",
          text: "Post Id",
        },
        {
          id: "asodifjaosdf2",
          text: "Post Id 2",
        },
        {
          id: "asodifjaosdf3",
          text: "Post Id 3",
        },
      ];
    }),
  createPostZodThree: zod3Middleware
    .meta({
      description: "Zod v3 procedure with merged input validators",
    })
    .input(
      z3.object({
        text: z3.string().min(1).describe("hi there").optional(),
        nested: z3
          .object({
            nestedText: z3.string().describe("what's happening").optional(),
            nestedAgain: z3.object({
              nest: z3.boolean().describe("cool bool"),
            }),
          })
          .describe("object descriptions"),
        optionalProp: z3.string().optional(),
      }),
    )
    .mutation(({ input }) => {
      return {
        ...input,
      };
    }),
  createPostZodFour: procedure
    .input(
      z4.object({
        title: z4.string().min(1).describe("Post title"),
        content: z4.string().describe("Post content"),
      }),
    )
    .mutation(({ input }) => {
      return {
        id: "generated-id",
        ...input,
        createdAt: new Date().toISOString(),
      };
    }),
  mergedZodFour: zod4Middleware
    .input(
      z4.object({
        testNum: z4.number(),
      }),
    )
    .query(({ input }) => {
      return {
        called: new Date().toString(),
        ...input,
      };
    }),
  basicArktype: procedure
    .input(
      type({
        test: "string",
      }),
    )
    .query(({ input }) => {
      return input;
    }),
  createPostArkType: arktypeVal
    .input(
      type({
        test: "string",
        test3: "number > 5",
      }),
    )
    .query(({ input }) => {
      return {
        message: "ArkType validation successful",
        data: input,
      };
    }),
  createPostValibot: procedure
    .input(v.object({ name: v.string() }))
    .mutation(({ input }) => {
      return {
        success: true,
        user: input,
      };
    }),
  mergedZod3Procedure: zod3Middleware
    .input(
      z3.object({
        additionalField: z3
          .string()
          .describe("Additional field for merged validation"),
      }),
    )
    .query(({ input }) => {
      return {
        message: "Merged Zod v3 validation",
        data: input,
      };
    }),

  //! This breaks, but I think it is an issue with json schema features maybe not being supported?
  mergedArktypeProcedure: arktypeVal
    .input(
      type({
        category: "string",
        priority: "'low' | 'medium' | 'high'",
      }),
    )
    .mutation(({ input }) => {
      return {
        message: "Merged ArkType validation",
        result: input,
      };
    }),
  mergedValibot: valibotMiddleware
    .input(v.object({ name: v.string() }))
    .mutation(({ input }) => {
      return {
        success: true,
        user: input,
      };
    }),

  deep: deepRouter,
});

export const appRouter = createTRPCRouter({
  postsRouter,
  anotherRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
