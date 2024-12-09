import React from "react";

export function FormLabel({ children }: { children: string }) {
  return <span className="font-bold text-md text-neutralText">{children}</span>;
}
