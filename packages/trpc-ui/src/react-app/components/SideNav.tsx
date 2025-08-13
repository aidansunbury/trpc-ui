import type { ParsedProcedure } from "@src/parse/parseProcedure";
import type {
  ParsedTRPCRouter,
  Router,
  RouterOrProcedure,
} from "@src/parseV2/types";
import { Chevron } from "@src/react-app/components/Chevron";
import { ItemTypeIcon } from "@src/react-app/components/ItemTypeIcon";
import {
  collapsables,
  useSiteNavigationContext,
} from "@src/react-app/components/contexts/SiteNavigationContext";
import { useCollapsableIsShowing } from "@src/react-app/components/contexts/SiteNavigationContext";
import { colorSchemeForNode } from "@src/react-app/components/style-utils";
import React, { useCallback } from "react";
import type { ParsedRouter } from "../../parse/parseRouter";
export function SideNav({
  // rootRouter,
  open,
  parsedRoouter,
}: {
  open: boolean;
  // rootRouter: ParsedRouter;
  parsedRoouter: ParsedTRPCRouter;
  setOpen: (value: boolean) => void;
}) {
  return open ? (
    <div
      style={{ maxHeight: "calc(100vh - 4rem)" }}
      className="flex min-w-[16rem] flex-col items-start space-y-2 overflow-scroll border-r-2 border-r-panelBorder bg-actuallyWhite p-2 pr-4 shadow-sm"
    >
      {Object.entries(parsedRoouter).map(([key, routerOrProcedure]) => {
        return <SideNavItem node={routerOrProcedure} key={key} />;
      })}
    </div>
  ) : null;
}

//* Fix
function SideNavItem({
  node,
  // path,
}: {
  node: RouterOrProcedure;
  // path: string[];
}) {
  const { markForScrollTo } = useSiteNavigationContext();
  const shown = useCollapsableIsShowing(node.path) || node.path.length === 0;

  const onClick = useCallback(function onClick() {
    collapsables.toggle(node.path);
    markForScrollTo(node.path);
  }, []);

  return (
    <>
      {node.path.length > 0 && (
        <button
          type="button"
          className={`flex w-full flex-row items-center justify-between font-bold ${
            shown ? "" : "opacity-70"
          }`}
          onClick={onClick}
        >
          <span className="flex flex-row items-start">
            <ItemTypeIcon colorScheme={colorSchemeForNode(node)} />
            {node.path[node.path.length - 1]}
          </span>

          {node.type === "router" ? (
            <Chevron
              className={"ml-2 h-3 w-3 " + ""}
              direction={shown ? "down" : "right"}
            />
          ) : (
            <div />
          )}
        </button>
      )}
      {shown && node.type === "router" && (
        <div className="flex flex-col items-start space-y-2 self-stretch pl-2">
          {Object.entries(node.children).map(([key, node]) => {
            return <SideNavItem node={node} key={key} />;
          })}
        </div>
      )}
    </>
  );
}
