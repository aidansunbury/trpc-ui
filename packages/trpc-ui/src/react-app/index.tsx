import React from "react";
import ReactDOM from "react-dom/client";
import type { ParsedRouter } from "../parse/parseRouter";
import { RootComponent } from "./Root";
import "./index.css";
import { trpc } from "@src/react-app/trpc";
import type { RenderOptions } from "@src/render";

// this gets replaced with the parsed router object
const routerDefinition: ParsedRouter =
  "{{parsed_router}}" as unknown as ParsedRouter;

// Here are other options
export const options = "{{options}}" as unknown as RenderOptions;
// biome-ignore lint/style/noNonNullAssertion: <Root non-null>
const root = ReactDOM.createRoot(document.getElementById("root")!);
root;
trpc;
RootComponent;
React;
root.render(
  <RootComponent
    rootRouter={routerDefinition}
    options={options}
    trpc={trpc}
    parsedRouter={{}}
  />,
);
