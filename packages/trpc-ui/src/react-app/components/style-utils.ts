import type { RouterOrProcedure } from "@src/parseV2/types";
import type { ColorSchemeType } from "@src/react-app/components/CollapsableSection";
export function solidColorBg(type: ColorSchemeType) {
  switch (type) {
    case "mutation":
      return "bg-mutation-solid";
    case "query":
      return "bg-query-solid";
    case "router":
      return "bg-router-solid";
    case "neutral":
      return "bg-neutral-solid";
    case "subscription":
      return "bg-subscription-solid";
  }
}

export function solidColorBorder(type: ColorSchemeType) {
  switch (type) {
    case "mutation":
      return "border-mutation-solid";
    case "query":
      return "border-query-solid";
    case "router":
      return "border-router-solid";
    case "neutral":
      return "border-neutral-solid";
    case "subscription":
      return "border-subscription-solid";
  }
}

export function backgroundColor(type: ColorSchemeType) {
  switch (type) {
    case "mutation":
      return "bg-mutation-bg";
    case "neutral":
      return "bg-neutral-bg";
    case "query":
      return "bg-query-bg";
    case "router":
      return "bg-router-bg";
    case "subscription":
      return "bg-subscription-bg";
  }
}

export function backgroundColorDark(type: ColorSchemeType) {
  switch (type) {
    case "mutation":
      return "bg-mutation-bg-dark";
    case "neutral":
      return "bg-neutral-bg-dark";
    case "query":
      return "bg-query-bg-dark";
    case "router":
      return "bg-router-bg-dark";
    case "subscription":
      return "bg-subscription-bg-dark";
  }
}

export function textColor(type: ColorSchemeType) {
  switch (type) {
    case "mutation":
      return "text-mutation-text";
    case "neutral":
      return "text-neutral-text";
    case "query":
      return "text-query-text";
    case "router":
      return "text-router-text";
    case "subscription":
      return "text-subscription-text";
  }
}

export function colorSchemeForNode(node: RouterOrProcedure): ColorSchemeType {
  return node.type;
}
