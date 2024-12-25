import dynamic from "next/dynamic";
import { parseRouterWithOptions } from "trpc-ui/parse/parseRouter";
import { RootComponent } from "trpc-ui/react-app/Root";
import { trpc } from "trpc-ui/react-app/trpc";
import { appRouter } from "~/router";
import { env } from "~/env.mjs";


console.log(`Using superjson: ${env.NEXT_PUBLIC_SUPERJSON}`)
const parse = parseRouterWithOptions(appRouter, { transformer: env.NEXT_PUBLIC_SUPERJSON === "false" ? undefined : "superjson" });

const App = dynamic(
  Promise.resolve(() => (
    <RootComponent
      rootRouter={parse}
      options={{
        url: "http://localhost:3000/api/trpc",
        transformer: env.NEXT_PUBLIC_SUPERJSON === "false" ? undefined : "superjson",
        meta: {
          title: "Dev App Title",
          description:
            "Dev App Description is longer and should support [markdown](https://github.com/aidansunbury/trpc-ui) \n## Heading 2\n### Heading 3 \n - list item 1\n - list item 2\n",
        },
      }}
      trpc={trpc}
    />
  )),
  { ssr: false },
);

const Component = () => {
  return <App />;
};

export default Component;
