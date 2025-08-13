import dynamic from "next/dynamic";
// import { parseRouterWithOptions } from "trpc-ui/parse/parseRouter";
import { parseTRPCRouter } from "trpc-ui/parseV2/parse";
import { RootComponent } from "trpc-ui/react-app/Root";
import { trpc } from "trpc-ui/react-app/trpc";
import { env } from "~/env.mjs";
import { appRouter } from "~/router";

console.log(`Using superjson: ${env.NEXT_PUBLIC_SUPERJSON}`);
// const parse = parseRouterWithOptions(appRouter, {
//   transformer: env.NEXT_PUBLIC_SUPERJSON === "false" ? undefined : "superjson",
// });

const parseV2 = parseTRPCRouter(appRouter);

const App = dynamic(
  Promise.resolve(() => (
    <RootComponent
      parsedRouter={parseV2}
      // rootRouter={parse}
      options={{
        url: `http://localhost:${String(env.NEXT_PUBLIC_PORT)}/api/trpc`,
        transformer: undefined,
        meta: {
          title: "Dev App Title",
          description: `http://localhost:${String(env.NEXT_PUBLIC_PORT)}/api/trpc`,
        },
      }}
    />
  )),
  { ssr: false },
);

const Component = () => {
  return <App />;
};

export default Component;
