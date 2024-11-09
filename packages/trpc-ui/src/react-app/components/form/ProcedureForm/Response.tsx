import React from "react";
import { FormSection } from "./FormSection";
import { JsonViewer } from "@textea/json-viewer";
import prettyBytes from "pretty-bytes";
import prettyMs from "pretty-ms";

export function Response({
  children,
  size,
  time,
}: {
  children: string | object;
  size?: number;
  time?: number;
}) {
  const title = size
    ? time
      ? `Response hello (${prettyBytes(size)}, ${prettyMs(time)})`
      : `Response hello (${prettyBytes(size)})`
    : time
    ? `Response hello (${prettyMs(time)})`
    : `Response hello`;

  if (typeof children === "object") {
    return (
      <FormSection title={title}>
        <JsonViewer rootName={false} value={children} quotesOnKeys={false} />
      </FormSection>
    );
  }

  return (
    <FormSection title={title}>
      <p className="font-mono whitespace-pre-wrap break-words">{children}</p>
    </FormSection>
  );
}
