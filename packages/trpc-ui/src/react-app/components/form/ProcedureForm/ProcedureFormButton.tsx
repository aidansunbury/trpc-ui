import React from "react";
import { Button } from "../../Button";
import type { ColorSchemeType } from "../../CollapsableSection";
import { SendIcon } from "../../icons/SendIcon";
import { LoadingSpinner } from "./LoadingSpinner";

export function ProcedureFormButton({
  text,
  colorScheme,
  loading,
}: {
  text: string;
  colorScheme: ColorSchemeType;
  loading: boolean;
}) {
  return (
    <Button
      variant={colorScheme}
      type="submit"
      className="relative justify-center self-stretch rounded-md"
      disabled={loading}
    >
      <div
        className={`flex flex-row${loading ? " pointer-events-none opacity-0" : ""}`}
      >
        {text}
        <SendIcon className="ml-2 h-5 w-5" />
      </div>
      {loading && <LoadingSpinner />}
    </Button>
  );
}
