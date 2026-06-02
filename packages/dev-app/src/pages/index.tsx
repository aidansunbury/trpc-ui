import dynamic from "next/dynamic";
// import { parseRouterWithOptions } from "trpc-ui/parse/parseRouter";
import { parseTRPCRouter } from "trpc-ui/parseV2/parse";
import { RootComponent } from "trpc-ui/react-app/Root";
// import { env } from "~/env.mjs";
import { appRouter } from "~/router";

console.log(`Using superjson: ${process.env.NEXT_PUBLIC_SUPERJSON}`);
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
        meta: {
          description: `http://localhost:${String(process.env.NEXT_PUBLIC_PORT)}/api/trpc`,
          title: "Dev App Title",
        },
        transformer: undefined,
        url: `http://localhost:${String(process.env.NEXT_PUBLIC_PORT)}/api/trpc`,
      }}
    />
  )),
  { ssr: false },
);

const Component = () => {
  return <App />;
};

export default Component;
