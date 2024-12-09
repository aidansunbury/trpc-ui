import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import React from "react";
import { FieldError } from "../FieldError";

export function BaseSelectField({
  value,
  onChange,
  options,
  errorMessage,
  label,
}: {
  value?: string;
  onChange: (value: string | undefined) => void;
  options: string[];
  errorMessage?: string;
  label: string;
}) {
  return (
    <FormControl fullWidth>
      <InputLabel size="small">{label}</InputLabel>
      <Select
        value={value ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        size="small"
        label={label}
        placeholder={label}
        sx={{
          div: {
            backgroundColor: "white",
          },
        }}
        error={!!errorMessage}
      >
        {options.map((e) => (
          <MenuItem key={e} value={e}>
            {e}
          </MenuItem>
        ))}
      </Select>
      {errorMessage && <FieldError errorMessage={errorMessage} />}
    </FormControl>
  );
}
