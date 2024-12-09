import type { ParsedProcedure } from "@src/parse/parseProcedure";
import { Chevron } from "@src/react-app/components/Chevron";
import { ItemTypeIcon } from "@src/react-app/components/ItemTypeIcon";
import {
  collapsables,
  useCollapsableIsShowing,
  useSiteNavigationContext,
} from "@src/react-app/components/contexts/SiteNavigationContext";
import { colorSchemeForNode } from "@src/react-app/components/style-utils";
import React, { useCallback } from "react";
import type { ParsedRouter } from "../../parse/parseRouter";
export function SideNav({
  rootRouter,
  open,
}: // setOpen,
{
  open: boolean;
  rootRouter: ParsedRouter;
  setOpen: (value: boolean) => void;
}) {
  return open ? (
    <div
      style={{ maxHeight: "calc(100vh - 4rem)" }}
      className="flex min-w-[16rem] flex-col items-start space-y-2 overflow-scroll border-r-2 border-r-panelBorder bg-actuallyWhite p-2 pr-4 shadow-sm"
    >
      <SideNavItem node={rootRouter} path={[]} />
    </div>
  ) : null;
}

function SideNavItem({
  node,
  path,
}: {
  node: ParsedRouter | ParsedProcedure;
  path: string[];
}) {
  const { markForScrollTo } = useSiteNavigationContext();
  const shown = useCollapsableIsShowing(path) || path.length === 0;

  const onClick = useCallback(function onClick() {
    collapsables.toggle(path);
    markForScrollTo(path);
  }, []);

  return (
    <>
      {path.length > 0 && (
        <button
          className={`flex w-full flex-row items-center justify-between font-bold ${
            shown ? "" : "opacity-70"
          }`}
          onClick={onClick}
        >
          <span className="flex flex-row items-start">
            <ItemTypeIcon colorScheme={colorSchemeForNode(node)} />
            {path[path.length - 1]}
          </span>

          {node.nodeType === "router" ? (
            <Chevron
              className={"ml-2 h-3 w-3 " + ""}
              direction={shown ? "down" : "right"}
            />
          ) : (
            <div />
          )}
        </button>
      )}
      {shown && node.nodeType === "router" && (
        <div className="flex flex-col items-start space-y-2 self-stretch pl-2">
          {Object.entries(node.children).map(([key, node]) => {
            return (
              <SideNavItem
                path={
                  node.nodeType === "procedure"
                    ? node.pathFromRootRouter
                    : node.path
                }
                node={node}
                key={key}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
