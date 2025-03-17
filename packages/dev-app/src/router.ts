import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, procedure } from "~/server/api/trpc";

const postsRouter = createTRPCRouter({
  complexSuperJson: procedure
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
      };
    }),
  meta: procedure
    .meta({
      description: "This is a router that contains posts",
    })
    .query(() => null),
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
          id: "asodifjaosdf",
          text: "Post Id",
        },
        {
          id: "asodifjaosdf",
          text: "Post Id",
        },
      ];
    }),
  createPost: procedure
    .input(
      z.object({
        text: z.string().min(1),
        nested: z.object({
          nestedText: z.string(),
        }),
      }),
    )
    .mutation(({ input }) => {
      return {
        ...input,
      };
    }),
  dateTest: procedure
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
      };
    }),
  createNestedPost: procedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .input(
      z.object({
        title: z.string(),
      }),
    )
    .mutation(({ input }) => {
      return {
        id: "aoisdjfoasidjfasodf",
        text: input.text,
      };
    }),
});
const discriminatedFieldEnum = z.enum(["One", "Two"]);

export const appRouter = createTRPCRouter({
  postsRouter,
  inputShowcaseRouter: createTRPCRouter({
    textInput: procedure
      .input(z.object({ aTextInput: z.string() }))
      .query(() => {
        return "It's an input";
      }),
    numberInput: procedure
      .input(z.object({ aNumberInput: z.number() }))
      .query(() => {
        return "It's an input";
      }),
    enumInput: procedure
      .input(z.object({ aEnumInput: z.enum(["One", "Two"]) }))
      .query(() => {
        return "It's an input";
      }),
    nativeEnumInput: procedure
      .input(z.object({ aEnumInput: z.nativeEnum({ ONE: "one", TWO: "two" }) }))
      .query(() => {
        return "It's an input";
      }),
    stringArrayInput: procedure
      .input(z.object({ aStringArray: z.string().array() }))
      .query(() => {
        return "It's an input";
      }),
    objectInput: procedure
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
    discriminatedUnionInput: procedure
      .input(
        z.object({
          aDiscriminatedUnion: z.discriminatedUnion("discriminatedField", [
            z.object({
              discriminatedField: z.literal("One"),
              aFieldThatOnlyShowsWhenValueIsOne: z.string(),
            }),
            z.object({
              discriminatedField: z.literal("Two"),
              aFieldThatOnlyShowsWhenValueIsTwo: z.object({
                someTextFieldInAnObject: z.string(),
              }),
            }),
            z.object({
              discriminatedField: z.literal("Three"),
            }),
          ]),
        }),
      )
      .query(() => {
        return "It's an input";
      }),
    unionInput: procedure
      .input(
        z.object({
          aUnion: z.union([z.literal("one"), z.literal(2)]),
        }),
      )
      .query(({ input }) => {
        return input;
      }),
    emailTextInput: procedure
      .input(
        z.object({
          email: z.string().email("That's an invalid email (custom message)"),
        }),
      )
      .query(() => {
        return "It's good";
      }),
    voidInput: procedure.input(z.void()).query(() => {
      return "yep";
    }),
  }),
  postSomething: procedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
      }),
    )
    .mutation(({ input: { title, content } }) => {
      return {
        title,
        content,
      };
    }),
  discriminatedUnionInput: procedure
    .input(
      z.object({
        aDiscriminatedUnion: z.discriminatedUnion("discriminatedField", [
          z.object({
            discriminatedField: discriminatedFieldEnum.extract(["One"]), // <-- this doesn't work
            aFieldThatOnlyShowsWhenValueIsOne: z.string(),
          }),
          z.object({
            discriminatedField: z.literal("Two"),
            aFieldThatOnlyShowsWhenValueIsTwo: z.object({
              someTextFieldInAnObject: z.string(),
            }),
          }),
        ]),
      }),
    )
    .query(({ input }) => {
      return input;
    }),
  procedureWithDescription: procedure
    .meta({
      description:
        "# This is a description\n\nIt's a **good** one.\nIt may be overkill in certain situations, but procedures descriptions can render markdown thanks to [react-markdown](https://github.com/remarkjs/react-markdown) and [tailwindcss-typography](https://github.com/tailwindlabs/tailwindcss-typography)\n1. Lists\n2. Are\n3. Supported\n but I *personally* think that [links](https://github.com/aidansunbury/trpc-ui) and images ![Image example](https://private-user-images.githubusercontent.com/64103161/384591987-7dc0e751-d493-4337-ac8d-a1f16924bf48.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MzExNDM3OTMsIm5iZiI6MTczMTE0MzQ5MywicGF0aCI6Ii82NDEwMzE2MS8zODQ1OTE5ODctN2RjMGU3NTEtZDQ5My00MzM3LWFjOGQtYTFmMTY5MjRiZjQ4LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDExMDklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQxMTA5VDA5MTEzM1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTE4YmM4OTlkZmYyNmJjOWI5YzgwZDUxOTVlYTBjODlkMTVkMzNlNmJjZDhkZDJiNTRhNzFmNDZhMzllNDc2ZGYmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.FsvDvXo6S7n4uOsi3LMUUOeEhjXq6LF88MlU60gzZ2k)\n are the most useful for documentation purposes",
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
        searchTerm2: z
          .string()
          .optional()
          .describe(
            "The name of the thing to search for. Really really long long long boi long boi long Really really long long long boi long boi long Really really long long long boi long boi long Really really long long long boi long boi long",
          ),
      }),
    )
    .query(() => {
      return "Was that described well enough?";
    }),
  nonObjectInput: procedure.input(z.string()).query(({ input }) => {
    return `Hello ${input}`;
  }),
  slowProcedure: procedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(async ({ input }) => {
      // two second delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return `Hello ${input.name}`;
    }),
  anErrorThrowingRoute: procedure
    .input(
      z.object({
        ok: z.string(),
      }),
    )
    .query(() => {
      throw new TRPCError({
        message: "It broke.",
        code: "FORBIDDEN",
      });
    }),
  allInputs: procedure
    .input(
      z.object({
        obj: z.object({
          string: z.string().optional(),
        }),
        stringMin5: z.string().min(5),
        numberMin10: z.number().min(10),
        stringOptional: z.string().optional(),
        enum: z.enum(["One", "Two"]),
        optionalEnum: z.enum(["Three", "Four"]).optional(),
        stringArray: z.string().array(),
        boolean: z.boolean(),
        discriminatedUnion: z.discriminatedUnion("disc", [
          z.object({
            disc: z.literal("one"),
            oneProp: z.string(),
          }),
          z.object({
            disc: z.literal("two"),
            twoProp: z.enum(["one", "two"]),
          }),
        ]),
        union: z.union([z.literal("one"), z.literal(2)]),
      }),
    )
    .query(() => ({ goodJob: "yougotthedata" })),
});

// export type definition of API
export type AppRouter = typeof appRouter;
