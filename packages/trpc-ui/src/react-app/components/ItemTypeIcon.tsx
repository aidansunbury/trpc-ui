import type { ColorSchemeType } from "@src/react-app/components/CollapsableSection";
import { textColor } from "@src/react-app/components/style-utils";
import React from "react";

export function ItemTypeIcon({
  colorScheme,
}: {
  colorScheme: ColorSchemeType;
}) {
  const letter = colorScheme[0]?.toUpperCase();
  return (
    <span className={`mr-1 font-bold ${textColor(colorScheme)}`}>{letter}</span>
  );
}
