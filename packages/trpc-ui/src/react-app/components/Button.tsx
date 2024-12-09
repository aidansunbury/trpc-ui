import type { ColorSchemeType } from "@src/react-app/components/CollapsableSection";
import { solidColorBg } from "@src/react-app/components/style-utils";
import React from "react";
import type { ButtonHTMLAttributes } from "react";

export function Button({
  variant,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant: ColorSchemeType }) {
  return (
    <button
      {...props}
      className={`flex flex-row items-center self-end rounded-md border-2 border-transparent p-2 text-base text-white focus:border-yellow-500${props.className ? ` ${props.className}` : ""} ${solidColorBg(variant)}`}
    />
  );
}
