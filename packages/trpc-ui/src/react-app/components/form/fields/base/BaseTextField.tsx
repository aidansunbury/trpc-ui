import { default as MUITextField } from "@mui/material/TextField";
import { useEnableInputGlobalHotkeys } from "@src/react-app/components/contexts/HotKeysContext";
import React, { type InputHTMLAttributes, useRef } from "react";

export function BaseTextField({
  value,
  onChange,
  errorMessage,
  label,
  inputProps,
  fieldId,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string;
  label?: string;
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  >;
  fieldId?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEnableInputGlobalHotkeys(inputRef, []);
  return (
    <MUITextField
      inputRef={inputRef}
      variant="outlined"
      label={label}
      id={fieldId}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`flex rounded-sm border border-grey-700 p-2 flex-col${className ? ` ${className}` : ""}`}
      placeholder={label ? `Enter value for ${label}` : undefined}
      {...inputProps}
      color="primary"
      size="small"
      sx={{ input: { backgroundColor: "white" } }}
      error={!!errorMessage}
      helperText={errorMessage}
    />
    // {errorMessage && <FieldError errorMessage={errorMessage} />}
  );
}
