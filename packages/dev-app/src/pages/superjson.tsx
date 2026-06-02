import dynamic from "next/dynamic";
import { parseTRPCRouter } from "trpc-ui/parseV2/parse";
import { RootComponent } from "trpc-ui/react-app/Root";
import { appRouterSuperjson } from "~/router-superjson";

console.log("Using superjson: true");

const parseV2 = parseTRPCRouter(appRouterSuperjson);

const App = dynamic(
  Promise.resolve(() => (
    <RootComponent
      parsedRouter={parseV2}
      options={{
        meta: {
          description: "Testing trpc-ui with superjson support",
          title: "Dev App Title (Superjson)",
        },
        transformer: "superjson",
        url: `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/trpc-superjson`,
      }}
    />
  )),
  { ssr: false },
);

const Component = () => {
  return <App />;
};

export default Component;
