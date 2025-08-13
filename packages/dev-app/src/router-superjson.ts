import { TRPCError } from "@trpc/server";
import { initTRPC } from "@trpc/server";
import { type } from "arktype";
import superjson from "superjson";
import type { TRPCPanelMeta } from "trpc-ui";
import * as v from "valibot";
import { ZodError } from "zod";
import * as z from "zod/v3";
import * as z4 from "zod/v4";
import { createTRPCContext } from "~/server/api/trpc";

// Create a separate tRPC instance with superjson transformer
const tSuperjson = initTRPC
  .context<typeof createTRPCContext>()
  .meta<TRPCPanelMeta>()
  .create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          zodError:
            error.cause instanceof ZodError ? error.cause.flatten() : null,
        },
      };
    },
    allowOutsideOfServer: true,
  });

const loggingMiddleware = tSuperjson.middleware(
  async ({ next, path, type, getRawInput }) => {
    const rawInput = await getRawInput();
    console.log(`🔍 [SUPERJSON ${type.toUpperCase()}] ${path}`);
    console.log("Raw Input:", rawInput);
    console.log("Input type:", typeof rawInput);
    console.log("Input JSON:", JSON.stringify(rawInput, null, 2));
    return next();
  },
);

export const createTRPCRouterSuperjson = tSuperjson.router;
export const procedureSuperjson = tSuperjson.procedure.use(loggingMiddleware);

const secondValidator = procedureSuperjson
  .input(
    z.object({
      needString: z.string(),
    }),
  )
  .use(({ ctx, next }) => {
    return next({ ctx });
  });

const arktypeVal = procedureSuperjson
  .input(
    type({
      name: "string",
    }),
  )
  .use(({ ctx, next }) => {
    return next({ ctx });
  });

const deepRouterSuperjson = createTRPCRouterSuperjson({
  coolQueryWithDate: procedureSuperjson
    .input(
      z.object({
        needString: z.string(),
        createdAt: z.date(),
      }),
    )
    .query(({ input }) => ({
      data: "thing with date",
      date: input.createdAt,
    })),
});

// {"0":{"json":{"memo":"dd","transactionId":"txn_01K2B49GD0HE7FZFY33TBEZC3E"}}}

// valid query
// http://localhost:3000/trpc/transaction.budgetOptions?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%7B%22transactionId%22%3A%22txn_01K23XPNG0J376K8N7FYE0PNHT%22%7D%7D%7D

const validResult = {
  result: {
    data: {
      json: {
        addressLine1: "223  West Wilkinson Street",
        addressLine2: null,
        city: "Kill Devil Hills",
        county: null,
        id: "add_01K0W56VT9EMQV4BAWTJ6E2KZJ",
        isBilling: true,
        isDefault: false,
        name: "Billing Address",
        organizationId: "org_01K0W548C5G5ANPVYH9A0FFQ91",
        state: "NC",
        zipcode: "27948",
      },
    },
  },
};

const postsRouterSuperjson = createTRPCRouterSuperjson({
  nothing: procedureSuperjson.input(z.any()).query(({ input }) => {
    return {
      testSet: new Set(["asd"]),
      test: Math.random(),
    };
  }),
  superMutation: procedureSuperjson
    .input(
      type({
        test: "string",
        value: "string",
      }),
    )
    .mutation(({ input }) => {
      return {
        ...input,
      };
    }),
  superQuery: procedureSuperjson
    .input(
      type({
        test: "string",
        value: "string",
      }),
    )
    .query(({ input }) => {
      return {
        theTest: input.test,
        theValue: input.value,
      };
    }),
  complexSuperJson: procedureSuperjson
    .input(
      z.object({
        id: z.bigint(),
        name: z.string(),
        createdAt: z.date(),
        tags: z.set(z.string()),
        metadata: z.map(z.string(), z.string()),
      }),
    )
    .query(({ input }) => {
      return {
        message: "You used superjson!",
        input: input,
        processedAt: new Date(),
      };
    }),

  dateTest: procedureSuperjson
    .input(
      z.object({
        date: z.date(),
        nested: z.object({
          text: z.string(),
        }),
      }),
    )
    .mutation(({ input }) => {
      console.log(input);
      return {
        id: "aoisdjfoasidjfasodf",
        time: input.date.getTime(),
        originalDate: input.date,
      };
    }),

  createPostZodThreeSuperjson: secondValidator
    .meta({
      description:
        "Zod v3 procedure with superjson types and merged validators",
    })
    .input(
      z.object({
        text: z.string().min(1).describe("hi there").optional(),
        createdAt: z.date().describe("Creation date"),
        tags: z.set(z.string()).describe("Post tags"),
        metadata: z.map(z.string(), z.string()).describe("Additional metadata"),
      }),
    )
    .mutation(({ input }) => {
      return {
        ...input,
        processedAt: new Date(),
      };
    }),

  createPostZodFourSuperjson: procedureSuperjson
    .input(
      z4.object({
        title: z4.string().min(1).describe("Post title"),
        content: z4.string().describe("Post content"),
        publishedAt: z4.coerce.date().describe("Publication date"),
        categories: z4.set(z4.string()).describe("Post categories"),
      }),
    )
    .mutation(({ input }) => {
      return {
        id: "generated-id",
        ...input,
        createdAt: new Date(),
      };
    }),

  // createPostArkTypeSuperjson: arktypeVal
  //   .input(
  //     type({
  //       name: "string",
  //       age: "string",
  //       birthDate: "Date",
  //     }),
  //   )
  //   .query(({ input }) => {
  //     return {
  //       message: "ArkType validation with Date successful",
  //       data: input,
  //       processedAt: new Date(),
  //     };
  //   }),

  // createPostValibotSuperjson: procedureSuperjson
  //   .input(
  //     v.object({
  //       email: v.pipe(v.string(), v.email()),
  //       username: v.pipe(v.string(), v.minLength(3)),
  //       registeredAt: v.date(),
  //       preferences: v.map(v.string(), v.string()),
  //     }),
  //   )
  //   .mutation(({ input }) => {
  //     return {
  //       success: true,
  //       user: input,
  //       processedAt: new Date(),
  //     };
  //   }),

  // mergedZod3SuperjsonProcedure: secondValidator
  //   .input(
  //     z.object({
  //       additionalField: z
  //         .string()
  //         .describe("Additional field for merged validation"),
  //       timestamps: z.set(z.date()).describe("Set of timestamps"),
  //     }),
  //   )
  //   .query(({ input }) => {
  //     return {
  //       message: "Merged Zod v3 validation with superjson",
  //       data: input,
  //       processedAt: new Date(),
  //     };
  //   }),

  // mergedArktypeSuperjsonProcedure: arktypeVal
  //   .input(
  //     type({
  //       category: "string",
  //       priority: "'low' | 'medium' | 'high'",
  //       dueDate: "Date",
  //       // labels: "Set<string>",
  //     }),
  //   )
  //   .mutation(({ input }) => {
  //     return {
  //       message: "Merged ArkType validation with superjson",
  //       result: input,
  //       processedAt: new Date(),
  //     };
  //   }),

  // deep: deepRouterSuperjson,
});

export const appRouterSuperjson = createTRPCRouterSuperjson({
  postsRouterSuperjson,
});

export type AppRouterSuperjson = typeof appRouterSuperjson;
