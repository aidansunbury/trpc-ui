import React from "react";
import ReactDOM from "react-dom/client";
import type { ParsedTRPCRouter } from "@src/parseV2/types";
import { RootComponent } from "./Root";
import "./index.css";
import type { RenderOptions } from "@src/render";

// this gets replaced with the parsed router object
const routerDefinition: ParsedTRPCRouter =
  "{{parsed_router}}" as unknown as ParsedTRPCRouter;

// Here are other options
export const options = "{{options}}" as unknown as RenderOptions;
// biome-ignore lint/style/noNonNullAssertion: <Root non-null>
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <RootComponent parsedRouter={routerDefinition} options={options} />,
);
