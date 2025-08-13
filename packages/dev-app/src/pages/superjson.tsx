import dynamic from "next/dynamic";
import { parseTRPCRouter } from "trpc-ui/parseV2/parse";
import { RootComponent } from "trpc-ui/react-app/Root";
import { env } from "~/env.mjs";
import { appRouterSuperjson } from "~/router-superjson";

console.log("Using superjson: true");

const parseV2 = parseTRPCRouter(appRouterSuperjson);

const App = dynamic(
  Promise.resolve(() => (
    <RootComponent
      parsedRouter={parseV2}
      options={{
        url: `http://localhost:${env.NEXT_PUBLIC_PORT}/api/trpc-superjson`,
        transformer: "superjson",
        meta: {
          title: "Dev App Title (Superjson)",
          description: "Testing trpc-ui with superjson support",
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
