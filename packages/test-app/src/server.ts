import * as trpcExpress from "@trpc/server/adapters/express";
import connectLiveReload from "connect-livereload";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { renderTrpcPanel } from "trpc-ui";
import { testRouter } from "./router.js";
dotenv.config();

const serverUrl = process.env.SERVER_URL || "http://localhost";
const trpcPath = process.env.TRPC_PATH || "trpc";
const port = Number(process.env.PORT) || 4000;

console.log("Starting server with environment variables:");
console.log(process.env);

// to marginally improve local development experience
const liveReload = process.env.LIVE_RELOAD === "true";
const simulateDelay = process.env.SIMULATE_DELAY === "true";

if (!serverUrl) throw new Error("No SERVER_URL passed.");
if (!trpcPath) throw new Error("No TRPC_PATH passed.");

async function createContext(opts: trpcExpress.CreateExpressContextOptions) {
  const authHeader = opts.req.headers.authorization;
  return {
    authorized: !!authHeader,
  };
}

const expressApp = express();
expressApp.use(cors({ origin: "*" }));

if (liveReload) {
  expressApp.use(connectLiveReload());
}

if (simulateDelay) {
  console.log("Simulating delay...");
  expressApp.use((req, res, next) => {
    setTimeout(() => {
      next();
      console.log("Next in timeout");
    }, 1000);
  });
}

expressApp.use(morgan("short", {}));
expressApp.use(
  `/${trpcPath}`,
  trpcExpress.createExpressMiddleware({
    router: testRouter,
    createContext,
  }),
);

console.log("Starting at url ");
console.log(`${serverUrl}${port ? `:${port}` : ""}/${trpcPath}`);

expressApp.get("/", (_req, res) => {
  console.log("Got request");
  res.send(
    renderTrpcPanel(testRouter as any, {
      url: `${serverUrl}${
        process.env.NODE_ENV === "production" ? "" : `:${port}`
      }/${trpcPath}`,
      transformer: "superjson",
      meta: {
        title: "Demo tRPC Panel",
        description:
          "A panel like this will be automatically generated when you add trpc-ui to your project. This main description, and procedure descriptions support markdown.\n\nIf you prefer to input raw JSON instead of using the auto generated forms, click the {} bracket icon to toggle json mode.\n\n[Repo](https://github.com/aidansunbury/trpc-ui) [NPM](https://www.npmjs.com/package/trpc-ui)",
      },
    }),
  );
});

expressApp.listen(port ? port : 4000);
