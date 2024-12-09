import React from "react";
import type { LabelHTMLAttributes } from "react";

export function FieldLabel({
  children,
  ...props
}: {
  children: string;
} & LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props}>{children}</label>;
}
