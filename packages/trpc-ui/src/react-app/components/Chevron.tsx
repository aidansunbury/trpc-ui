import { ChevronIcon } from "@src/react-app/components/icons/ChevronIcon";
import React from "react";

export function Chevron({
  className,
  direction,
}: {
  className?: string;
  direction: "up" | "down" | "right" | "left";
}) {
  return (
    <ChevronIcon
      className={`${className} ${(() => {
        switch (direction) {
          case "up":
            return " -rotate-[270deg]";
          case "down":
            return "-rotate-90";
          case "right":
            return "rotate-180";
          case "left":
            return "";
        }
      })()}`}
    />
  );
}
