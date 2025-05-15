import React, { useCallback, useEffect, useRef } from "react";
import type { ParsedInputNode } from "@src/parse/parseNodeTypes";
import { type Control, useController, useWatch } from "react-hook-form"
import { FormLabel } from "../FormLabel";
import { FieldError } from "./FieldError";

export function FileField({
  name,
  label,
  control,
  node,
}: {
  name: string;
  label: string;
  control: Control<any>;
  node: ParsedInputNode & { type: "file" };
}) {
  const { field, fieldState } = useController({
    name,
    control,
  });
  const fieldId = node.path.join(".");
  const fileInput = useCallback((node: HTMLInputElement) => {
    if (field.value instanceof File && node) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(field.value);
      node.files = dataTransfer.files;
    }
  }, [field.value]);

  return <>
    <FormLabel>{label}</FormLabel>
    <input
      ref={fileInput}
      id={fieldId}
      type="file"
      onBlur={field.onBlur}
      onChange={(e) => {
        const file = e.target.files?.[0];
        field.onChange(file)
      }} />
      {fieldState.error && <FieldError errorMessage={fieldState.error.message!}/>}
  </>
}