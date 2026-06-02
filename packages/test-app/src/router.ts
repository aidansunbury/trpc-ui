import { EventEmitter } from "node:events";
import { initTRPC, TRPCError } from "@trpc/server";
import type * as trpcExpress from "@trpc/server/adapters/express";
import { observable } from "@trpc/server/observable";
import superjson from "superjson";
import { z } from "zod";

type TRPCMeta = Record<string, unknown>;
type Meta<TMeta = TRPCMeta> = TMeta & {
  description?: string;
  cool?: string;
};
const t = initTRPC
  .context<ContextType>()
  .meta<Meta>()
  .create({ isServer: true, transformer: superjson });

async function createContext(opts: trpcExpress.CreateExpressContextOptions) {
  const authHeader = opts.req.headers.authorization;
  const authorized = authHeader !== undefined && authHeader !== "";
  console.log("Request headers: ");
  console.log(authHeader);
  return {
    authorized: authorized,
  };
}

type ContextType = Awaited<ReturnType<typeof createContext>>;

const PostSchema = z.object({
  id: z.string().uuid(),
  text: z.string().min(1),
});

type Post = z.infer<typeof PostSchema>;

const UserSchema = z.object({
  id: z.string(),
  interests: z.string().array(),
  username: z.string(),
});

type User = z.infer<typeof UserSchema>;

const IDSchema = z.object({
  id: z.string(),
});

const fakeData: {
  user: User;
} = {
  user: {
    id: "f43cb448-1194-4528-80c7-b6f9287ad5fa",
    interests: [
      "type safety",
      "using 'as any'",
      "mindfulness meditation",
      "mcu movies",
    ],
    username: "trpclover47",
  },
};

const userRouter = t.router({
  deleteUser: t.procedure.input(IDSchema).mutation(() => {
    return {
      message: "User deleted (not really)",
    };
  }),
  getAllUsers: t.procedure.query(() => {
    return [fakeData.user, fakeData.user, fakeData.user, fakeData.user];
  }),
  getUserById: t.procedure.input(IDSchema).query((_old) => {
    return fakeData.user;
  }),
  updateUser: t.procedure.input(UserSchema).mutation(({ input }) => {
    return input;
  }),
});

const postsRouter = t.router({
  createPost: t.procedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .mutation(({ input }) => {
      return {
        id: "aoisdjfoasidjfasodf",
        text: input.text,
      };
    }),
  getAllPosts: t.procedure.query(() => {
    return [
      {
        id: "asodifjaosdf",
        text: "Post Id",
      },
      {
        id: "asodifjaosdf",
        text: "Post Id",
      },
      {
        id: "asodifjaosdf",
        text: "Post Id",
      },
    ];
  }),
});

const multiRouter = {
  postsRouter,
  userRouter,
};

// TODO unimplemented
const ee = new EventEmitter();
const _subscriptionRouter = t.router({
  add: t.procedure.input(PostSchema).mutation(async ({ input }) => {
    const post = { ...input }; /* [..] add to db */
    ee.emit("add", post);
    return post;
  }),
  onAdd: t.procedure.subscription(() => {
    // `resolve()` is triggered for each client when they start subscribing `onAdd`
    // return an `observable` with a callback which is triggered immediately
    return observable<Post>((emit) => {
      const onAdd = (data: Post) => {
        // emit data to client
        emit.next(data);
      };
      // trigger `onAdd()` when `add` is triggered in our event emitter
      ee.on("add", onAdd);
      // unsubscribe function when client disconnects or stops subscribing
      return () => {
        ee.off("add", onAdd);
      };
    });
  }),
});

enum Fruits {
  Apple = "apple",
  Banana = "banana",
  Cherry = "cherry",
}

export const testRouter = t.router({
  allInputs: t.procedure
    .input(
      z.object({
        boolean: z.boolean(),
        discriminatedUnion: z.discriminatedUnion("disc", [
          z.object({
            disc: z.literal("one"),
            oneProp: z
              .string()
              .describe("Selecting one gives you a string input"),
          }),
          z
            .object({
              disc: z.literal("two"),
              twoProp: z
                .enum(["one", "two"])
                .describe("Selecting two gives you an enum input"),
            })
            .describe(
              'The "disc" property on the zod discriminated union determines the shape of the rest of the zod validator and inputs.',
            ),
        ]),
        enum: z.enum(["One", "Two"]),
        numberMin10: z.number().min(10),
        obj: z
          .object({
            numberProperty: z.number().optional(),
            stringProperty: z.string().optional(),
          })
          .describe("An object with two properties."),
        optionalEnum: z.enum(["Three", "Four"]).optional(),
        stringArray: z.string().array(),
        stringMin5: z.string().min(5),
        stringOptional: z.string().optional(),
      }),
    )
    .query(({ input }) => ({ ...input })),

  anErrorThrowingRoute: t.procedure
    .input(
      z.object({
        ok: z.string(),
      }),
    )
    .query(() => {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "It's pretty bad over here.",
      });
    }),
  authorizedProcedure: t.procedure
    .meta({
      description:
        'This procedure requires an "authorization" header to be set in the request. If it is not set, it will throw an "UNAUTHORIZED" error, and otherwise it will return "Authorized!"',
    })
    .mutation(({ ctx }) => {
      if (!ctx.authorized) throw new TRPCError({ code: "UNAUTHORIZED" });
      return "Authorized!";
    }),
  combinedInputs: t.procedure
    .meta({
      description:
        "tRPC ui now supports merged input validators. This use case makes creating composable procedures with middlewares easier. The three properties come from three septate .input() calls which automatically get merged into one zod validator. \n~~~ts\nt.procedure\n\t.input(\n\t\tz.object({\n\t\t\tuserId: z.string(),\n\t\t}),\n\t)\n\t.input(\n\t\tz.object({\n\t\t\torganizationId: z.string(),\n\t\t}),\n\t)\n\t.input(\n\t\tz.object({\n\t\t\tpostId: z.string(),\n\t\t}),\n\t)\n\t.query(({ input }) => {\n\t\treturn input;\n\t}),\n~~~\nThe above code generated this procedure.",
    })
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .input(
      z.object({
        organizationId: z.string(),
      }),
    )
    .input(
      z.object({
        postId: z.string(),
      }),
    )
    .query(({ input }) => {
      return input;
    }),
  inputShowcaseRouter: t.router({
    any: t.procedure
      .meta({
        description:
          "This procedure has a zod 'any' input. No input components will display, but you can use the JSON editor in input any arbitrary JSON.",
      })
      .input(z.any())
      .query(({ input }) => input),
    discriminatedUnionInput: t.procedure
      .input(
        z.object({
          aDiscriminatedUnion: z.discriminatedUnion("discriminatedField", [
            z.object({
              aFieldThatOnlyShowsWhenValueIsOne: z.string(),
              discriminatedField: z.literal("One"),
            }),
            z.object({
              aFieldThatOnlyShowsWhenValueIsTwo: z.object({
                someTextFieldInAnObject: z.string(),
              }),
              discriminatedField: z.literal("Two"),
            }),
          ]),
        }),
      )
      .query(({ input }) => {
        return "It's an input";
      }),
    emailTextInput: t.procedure
      .input(
        z.object({
          email: z.string().email("That's an invalid email (custom message)"),
        }),
      )
      .query(({ input }) => {
        return "It's good";
      }),
    enumInput: t.procedure
      .input(z.object({ aEnumInput: z.enum(["One", "Two"]) }))
      .query(() => {
        return "It's an input";
      }),
    nativeEnumInput: t.procedure
      .input(z.object({ aNativeEnumInput: z.nativeEnum(Fruits) }))
      .query(({ input }) => {
        return { fruit: input.aNativeEnumInput };
      }),
    numberInput: t.procedure
      .input(z.object({ aNumberInput: z.number() }))
      .query(() => {
        return "It's an input";
      }),
    objectInput: t.procedure
      .input(
        z.object({
          anObject: z.object({
            numberArray: z.number().array(),
          }),
        }),
      )
      .query(() => {
        return "It's an input";
      }),
    stringArrayInput: t.procedure
      .input(z.object({ aStringArray: z.string().array() }))
      .query(() => {
        return "It's an input";
      }),
    textInput: t.procedure
      .input(z.object({ aTextInput: z.string() }))
      .query(() => {
        return "It's an input";
      }),
    voidInput: t.procedure.input(z.void()).query(() => {
      return "yep";
    }),
  }),
  nestedRouters: t.router(multiRouter),
  nonObjectInput: t.procedure
    .meta({
      description:
        'This input is just a string, not a property on an object.\n~~~ts\nt.procedure\n\t.meta({\n\t\tdescription: "...",\n\t})\n\t.input(z.string())\n\t.query(({ input }) => {\n\t\treturn `Your input was ${input}`;\n\t}),',
    })
    .input(z.string())
    .query(({ input }) => {
      return `Your input was ${input}`;
    }),
  postsRouter: postsRouter,
  procedureWithDescription: t.procedure
    .meta({
      description:
        "# This is a description\n\nIt's a **good** one.\nIt may be overkill in certain situations, but procedures descriptions can render markdown thanks to [react-markdown](https://github.com/remarkjs/react-markdown) and [tailwindcss-typography](https://github.com/tailwindlabs/tailwindcss-typography)",
    })
    .input(
      z.object({
        id: z.string().describe("The id of the thing."),
        searchTerm: z
          .string()
          .optional()
          .describe(
            "Even term descriptions *can* render basic markdown, but don't get too fancy",
          ),
      }),
    )
    .query(() => {
      return "Was that described well enough?";
    }),
  userRouter: userRouter,
});
