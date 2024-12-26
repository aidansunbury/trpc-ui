import { JsonViewer } from "@textea/json-viewer";
import prettyBytes from "pretty-bytes";
import prettyMs from "pretty-ms";
import React from "react";
import { FormSection } from "./FormSection";

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
      ? `Response (${prettyBytes(size)}, ${prettyMs(time)})`
      : `Response (${prettyBytes(size)})`
    : time
      ? `Response (${prettyMs(time)})`
      : "Response";

  return (
    <FormSection title={title}>
      <JsonViewer rootName={false} value={children} quotesOnKeys={false} />
    </FormSection>
  );
}
