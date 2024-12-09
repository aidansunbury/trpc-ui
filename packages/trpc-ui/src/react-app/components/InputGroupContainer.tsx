import React, { type ReactNode } from "react";

export function InputGroupContainer({
  title,
  iconElement,
  children,
}: {
  title: string;
  iconElement?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      className={
        "flex flex-col overflow-hidden rounded-md border border-neutralSolid bg-[#fcfbf977] shadow-sm"
      }
    >
      <span className="mb-1 flex flex-row bg-white p-1">
        {iconElement} {title}
      </span>

      <div className={"flex flex-col space-y-2 p-1 "}>{children}</div>
    </div>
  );
}
