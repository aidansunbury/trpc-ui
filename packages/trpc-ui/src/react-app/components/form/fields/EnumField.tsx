import { type Control, useController } from "react-hook-form";
import { BaseSelectField } from "./base/BaseSelectField";

export function EnumField({
  name,
  label,
  control,
  options,
}: {
  name: string;
  label: string;
  control: Control<any>;
  options: string[];
}) {
  const { field, fieldState } = useController({
    control,
    name,
  });
  return (
    <BaseSelectField
      options={options}
      value={field.value}
      onChange={field.onChange}
      errorMessage={fieldState.error?.message}
      label={label}
    />
  );
}
