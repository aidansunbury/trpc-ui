import type { ParsedInputNode } from "@src/parse/parseNodeTypes";
import { type Control, useController } from "react-hook-form";
import { BaseTextField } from "./base/BaseTextField";

export function TextField({
  name,
  label,
  control,
  node: inputNode,
}: {
  name: string;
  label: string;
  control: Control;
  node: ParsedInputNode;
}) {
  const { field, fieldState } = useController({
    control,
    name,
  });

  return (
    <BaseTextField
      value={field.value ? field.value : ""}
      onChange={field.onChange}
      errorMessage={fieldState.error?.message}
      label={`${label}${inputNode.optional ? "" : "*"}`}
      fieldId={inputNode.path.join(".")}
    />
  );
}
