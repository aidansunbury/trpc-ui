import { CollapsableSection } from "@src/react-app/components/CollapsableSection";
import { ProcedureForm } from "@src/react-app/components/form/ProcedureForm";
import type { RenderOptions } from "@src/render";
import React from "react";
import type { ParsedRouter } from "../../parse/parseRouter";
import { cn } from "../utils/utils";

export function RouterContainer({
  router,
  options,
  name,
}: {
  router: ParsedRouter;
  options: RenderOptions;
  name?: string;
}) {
  const isRoot = router.path.length === 0;
  return (
    <CollapsableSection
      fullPath={router.path}
      titleElement={
        name && (
          <div>
            <h2 className="font-bold text-lg">{name}</h2>
          </div>
        )
      }
      sectionType="router"
      isRoot={isRoot}
    >
      <div
        className={cn("space-y-3", {
          "space-y-1 border-l-grey-400 p-1": !isRoot,
        })}
      >
        {Object.entries(router.children).map(
          ([childName, routerOrProcedure]) => {
            if (routerOrProcedure.nodeType === "router") {
              return (
                <div key={childName}>
                  <RouterContainer
                    name={childName}
                    options={options}
                    router={routerOrProcedure}
                  />
                </div>
              );
            }

            return (
              <div key={childName}>
                <ProcedureForm
                  name={childName}
                  procedure={routerOrProcedure}
                  options={options}
                />
              </div>
            );
          },
        )}
      </div>
    </CollapsableSection>
  );
}
