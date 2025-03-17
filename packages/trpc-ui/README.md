# tRPC.ui()

Probably the easiest and cheapest way to build a testing UI and documentation for your tRPC v11.0 endpoints. tRPC ui automatically generates a UI for manually testing your tRPC backend with 0 overhead:

![Screenshot 2022-12-08 at 7 24 02 PM](https://user-images.githubusercontent.com/12774588/206602120-017a2b3a-66c3-4bf0-bd93-90fb4bddf0cc.png)

trpc panel moves as fast as your trpc backend with minimal effort.

Check out our [demo app](https://trpc.aidansunbury.dev/)

## Fork Notice

This is a fork of the original [tRPC panel](https://github.com/iway1/trpc-panel) project, which is now unmaintained. The [original author](https://github.com/iway1) deserves credit for the vast majority of the work done on this project.

## Features

- 🚀 Automatically inspect your tRPC router and recursively generate a typesafe UI
- 🕒 Zero overhead
  - No output schemas (procedure return types can be inferred as nature intended)
  - New procedures will be added to your UI as you create them in your backend
  - No compilation required, works with any backend
- 📄 [Document](#documenting-procedures) your procedures and input parameters with minimal effort and markdown support
- 🐦 Supports nested routers, and nested input objects. The structure of the UI maps one-to-one to your API's routers and procedures.
- 🧭 SideNav and VSCode-like procedure / router search to quickly find what you're looking for
- ✨ [Transform](#data-transformers) data with built in `superjson` support.

## Quick Start

Install as a dev dependency with your preferred package manager:

```sh
npm install -D trpc-ui
```

```sh
yarn add -D trpc-ui
```

```sh
pnpm install -D trpc-ui
```

```sh
bun add -d trpc-ui
```

render your panel and return it from your backend as a text response (express example). You can also ensure that the panel is only available in development using dynamic imports and checking the `NODE_ENV`:

```js
app.use("/panel", (_, res) => {
  if (process.env.NODE_ENV !== "development") {
    return res.status(404).send("Not Found");
  }

  // Dynamically import renderTrpcPanel only in development
  const { renderTrpcPanel } = await import("trpc-ui");

  return res.send(
    renderTrpcPanel(myTrpcRouter, {
      url: "http://localhost:4000/trpc", // Base url of your trpc server
      meta: {
        title: "My Backend Title",
        description:
          "This is a description of my API, which supports [markdown](https://en.wikipedia.org/wiki/Markdown).",
      },
    })
  );
});
```

`trpc-ui` just renders as a string, so it can be used with any backend.

To document your entire backend, you can pass in a metadata object with a title and description. To document individual procedures, see the [documenting procedures](#documenting-procedures).

Make sure you specify whether or not you are using [superjson](https://trpc.io/docs/server/data-transformers#using-superjson) as a data transformer.

### NextJs App Router / create-t3-app example

Create a [route handler](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) somewhere like `src/app/api/panel/route.ts`

```ts
import { NextResponse } from "next/server";
import { appRouter } from "~/server/api/root";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse("Not Found", { status: 404 });
  }

  const { renderTrpcPanel } = await import("trpc-ui");

  return new NextResponse(
    renderTrpcPanel(appRouter, {
      url: "/api/trpc", // Default trpc route in nextjs
      transformer: "superjson", // Enabled by default with create-t3-app
    }),
    {
      status: 200,
      headers: [["Content-Type", "text/html"] as [string, string]],
    }
  );
}
```

Then we can visit the url `http://localhost:3000/api/panel` to use the panel.

### NextJS Pages Router example

Create an api route somewhere like `src/pages/api/panel.ts` and send a text response:

```ts
import type { NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "../../server/api/root";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV !== "development") {
    return res.status(404).send("Not Found");
  }

  const { renderTrpcPanel } = await import("trpc-ui");
  res.status(200).send(
    renderTrpcPanel(appRouter, {
      url: "/api/trpc",
      transformer: "superjson",
    })
  );
}
```

## Documenting Procedures

`trpc-ui` supports documenting procedures.

Documentation is opt-in, meaning you only need to set it up if you want to use it. When docs are included for your trpc procedure, a "Docs" section will appear in your procedure:

![Documentation Example](https://user-images.githubusercontent.com/12774588/208321430-6fea4c92-b0a9-4d9c-a95e-6bf5af04823b.png)

### Procedure Descriptions

`trpc-ui` supports documenting procedures via trpc meta. First setup your trpc instance to be typed with `TRPCPanelMeta`:

```ts
import { initTRPC } from "@trpc/server";
import { TRPCPanelMeta } from "trpc-ui";

const t = initTRPC.meta<TRPCPanelMeta>().create();
```

Then in your routers you can provide a description to the meta:

```ts
export const appRouter = t.router({
  sayHello: t.procedure
    .meta({ /* 👉 */ description: "This shows in the panel." })
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return { greeting: `Hello ${input.name}!` };
    });
});
```

### Markdown Support

Most descriptions don't need more than basic text, but descriptions for procedures and procedure descriptions can render markdown. This is most often useful for adding links within descriptions, but all markdown is supported thanks to [react-markdown](https://github.com/remarkjs/react-markdown).

```ts
.meta({ /* 👉 */ description: "# H1 heading\nSome normal, or maybe **bold** text below, and a [link](https://trpc.io/docs) to something important" })
```

### Input Parameter Descriptions

`trpc-ui` supports documenting parameters via zod's `.describe()` method. This allows developers to quickly write documentation as they're writing schemas:

```ts
export const appRouter = t.router({
  sayHello: t.procedure
    .input(z.object({
        name: z.string().describe("The name to say hello too.")
    }))
    .query(({ input }) => {
      return { greeting: `Hello ${input.name}!` };
    });
});
```

Whatever you pass to `describe()` will appear in the docs section. Any input fields without a description will not appear in the docs section.

## Data Transformers

Trpc panel supports [superjson](https://github.com/flightcontrolhq/superjson), just pass it into the transformer option:

```js
app.use("/panel", (_, res) => {
  return res.send(
    renderTrpcPanel(myTrpcRouter, {
      url: "http://localhost:4000/trpc",
      transformer: "superjson",
    })
  );
});
```

### Superjson example and usage

When you are using superjson, the json editor will show a basic wrapping of superjson input. Your actual json input goes under the _json_ key, and information about how fields should be parsed goes under the _meta_ key. Do not delete the _json_ key or enter your input outside of it, or else your input will not be parsed correctly.

```json
{
  "json": {},
  "meta": {
    "values": {}
  }
}
```

Let's say on your backend, you want to have a zod validator like this, which supports data types not supported by json directly.

```ts
import { z } from "zod";

const UserSchema = z.object({
  id: z.bigint(),
  name: z.string(),
  createdAt: z.date(),
  tags: z.set(z.string()),
  metadata: z.map(z.string(), z.string()),
});

type User = z.infer<typeof UserSchema>;

const user: User = {
  id: BigInt("9007199254740991"),
  name: "John Doe",
  createdAt: new Date("2025-03-16T12:00:00Z"),
  tags: new Set(["admin", "active"]),
  metadata: new Map([
    ["lastLogin", new Date("2025-03-15T08:30:00Z")],
    ["loginCount", 42],
    ["isPremium", true],
    ["tier", "gold"],
  ]),
};
```

Enter the json supported equivalent under the _json_ key, and and specify how they should be parsed under the _meta.values_ key. Before validating this data on the backend, superjson will deserialize it back into JavaScript bigints, dates, sets, and maps, meaning it will pass your zod validation!

```json
{
  "json": {
    "id": "9007199254740991",
    "name": "John Doe",
    "createdAt": "2025-03-16T12:00:00.000Z",
    "tags": ["admin", "active"],
    "metadata": [["tier", "gold"]]
  },
  "meta": {
    "values": {
      "id": ["bigint"],
      "createdAt": ["Date"],
      "tags": ["set"],
      "metadata": ["map"]
    }
  }
}
```

**You will likely need to uncheck "validate input on client" in order to be able to send your validation to the backend when using custom superjson inputs**

Also be warned that currently, input fields will not be rendered for superjson only inputs. You will have to input all data manually through the json editor.

## Contributing

`trpc-ui` welcomes and encourages open source contributions. Please see our [contributing](./CONTRIBUTING.md) guide for information on how to develop locally. Besides contributing PRs, one of the most helpful things you can to is to look at the existing [feature proposals](https://github.com/aidansunbury/trpc-ui/issues?q=sort%3Aupdated-desc%20is%3Aissue%20is%3Aopen%20label%3Aenhancement) and leave a 👍 on the features that would be most helpful for you.

## Comparisons

### trpc-openapi

[trpc-openapi](https://github.com/trpc/trpc-openapi) is designed for producing a REST API for external consumption from your trpc routers, not quickly testing your backed. If you do not care about exposing your API outside of your application, the additional overhead required to use `trpc-openapi` is not worth the effort. `trpc-ui` can be used with `trpc-openapi`, but the two libraries serve different purposes.

### trpc-playground

[trpc-playground](https://github.com/sachinraja/trpc-playground) is a great tool for testing your queries, but it requires writing code in the browser. `trpc-ui` automatically generates intuitive typesafe forms for your procedures, allowing you to run tests without writing any code.

## Limitations

Currently, tRPC panel only works with zod input schemas. Eventually, the goal is to support any validation library that implements the [Standard Schema](https://standardschema.dev/) spec. However, this will likely require lots of rewrites, as the current codebase is tightly integrated with Zod.

### Supported zod types

The following are supported

- Array
- BigInt
- Boolean
- Branded
- Default
- DiscriminatedUnion
- Effects
- Enum
- Literal
- NativeEnum
- Nullable
- Null
- Nullish
- Number
- Object
- Optional
- Promise
- String
- Undefined
- Any (Via json mode)

We would like to add the following types:

- Union
- Tuple
- Record
- Never
- Map (superjson only)
- Set (superjson only)
- Date (superjson only)
