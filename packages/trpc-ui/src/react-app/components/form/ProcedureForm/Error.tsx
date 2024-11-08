import React from "react";
import { ErrorRow } from "./ErrorRow";
import { StackTrace } from "./StackTrace";
import { FormSection } from "./FormSection";
import { TRPCErrorType } from "./index";

export function Error({ error }: { error: TRPCErrorType }) {
  const json = error.meta.responseJSON[0]?.error.json ?? ({} as any);
  const msg = json.message;
  const code = json.code;
  const data = json.data;
  const messageLength = msg ? msg.length : 0;
  const padTo = Math.max(messageLength, data.code.length);
  return (
    <FormSection titleClassName="text-error" title="Error">
      {msg && (
        <ErrorRow
          title="Message"
          text={msg + ` (code: ${code})`}
          padTitleTo={padTo}
        />
      )}
      <ErrorRow title="Code" text={data.code} padTitleTo={padTo} />
      <ErrorRow
        title="HTTP Status Code"
        text={data.httpStatus + ""}
        padTitleTo={padTo}
      />
      {data.stack && <StackTrace text={data.stack} />}
    </FormSection>
  );
}
