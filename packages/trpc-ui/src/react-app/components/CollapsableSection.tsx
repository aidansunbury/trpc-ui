import { Chevron } from "@src/react-app/components/Chevron";
import {
  collapsables,
  useCollapsableIsShowing,
} from "@src/react-app/components/contexts/SiteNavigationContext";
import { useSiteNavigationContext } from "@src/react-app/components/contexts/SiteNavigationContext";
import {
  backgroundColor,
  solidColorBg,
  solidColorBorder,
} from "@src/react-app/components/style-utils";
import { useQueryState } from "nuqs";
import React, {
  type MutableRefObject,
  type ReactNode,
  useEffect,
  useRef,
} from "react";

export type ColorSchemeType =
  | "query"
  | "mutation"
  | "router"
  | "neutral"
  | "subscription";
export function CollapsableSection({
  titleElement,
  fullPath,
  children,
  sectionType,
  isRoot,
  focusOnScrollRef,
}: {
  titleElement: ReactNode;
  fullPath: string[];
  children: ReactNode;
  sectionType: ColorSchemeType;
  isRoot?: boolean;
  focusOnScrollRef?: MutableRefObject<HTMLFormElement | null>;
}) {
  const { scrollToPathIfMatches } = useSiteNavigationContext();
  const shown = useCollapsableIsShowing(fullPath);
  const [path, setPath] = useQueryState("path");

  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (shown && containerRef.current) {
      if (scrollToPathIfMatches(fullPath, containerRef.current)) {
        // timeout or it'll immediately submit the form (which shows error messages)
        const firstChild =
          focusOnScrollRef?.current &&
          findFirstFormChildInput(focusOnScrollRef.current);
        if (firstChild) {
          setTimeout(() => {
            firstChild.focus({ preventScroll: true });
          }, 0);
        }
      }
    }
  }, [shown]);

  // deals with root router. If it's not collapsable we **simply** render the title element and children
  const collapsable = fullPath.length > 0;
  return (
    <div
      ref={containerRef}
      className={`flex flex-col drop-shadow-sm ${
        collapsable
          ? `${solidColorBorder(sectionType)} ${backgroundColor(sectionType)}`
          : ""
      }${!isRoot ? " rounded-[0.25rem] border" : ""}`}
    >
      {collapsable ? (
        <button
          type="button"
          onClick={() => {
            collapsables.toggle(fullPath);
            if (shown) {
              setPath(null);
            } else {
              setPath(fullPath.join("."));
            }
          }}
          className="flex flex-row items-center justify-between p-1 "
        >
          <span className="flex flex-row">
            <SectionTypeLabel className="mr-2" sectionType={sectionType} />
            {titleElement}
          </span>

          <Chevron
            className={"mr-2 h-4 w-4 animate-transform transition-transform"}
            direction={shown ? "up" : "down"}
          />
        </button>
      ) : (
        titleElement
      )}

      <div
        className={`flex-col justify-between ${collapsable ? ` border-t ${solidColorBorder(sectionType)}` : ""}${shown || !collapsable ? " flex" : " hidden"}`}
      >
        {children}
      </div>
    </div>
  );
}

export function SectionTypeLabel({
  sectionType,
  className,
}: {
  sectionType: ColorSchemeType;
  className?: string;
}) {
  return (
    <span
      className={`flex w-32 flex-row justify-center rounded-md p-1 font-bold text-base text-light ${solidColorBg(sectionType)}${className ? ` ${className}` : ""}`}
    >
      {sectionType.toUpperCase()}
    </span>
  );
}

function findFirstFormChildInput(formElement: HTMLFormElement) {
  for (let i = 0; i < formElement.elements.length; i++) {
    const child = formElement.elements[i];
    if (child?.tagName === "input" || child?.tagName === "INPUT") {
      return child as HTMLInputElement;
    }
  }
  return;
}
