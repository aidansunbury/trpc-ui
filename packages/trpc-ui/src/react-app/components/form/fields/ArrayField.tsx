import XIcon from "@mui/icons-material/CloseOutlined";
import DataArray from "@mui/icons-material/DataArray";
import type { ParsedInputNode } from "@src/parse/parseNodeTypes";
import { AddItemButton } from "@src/react-app/components/AddItemButton";
import { InputGroupContainer } from "@src/react-app/components/InputGroupContainer";
import { ROOT_VALS_PROPERTY_NAME } from "@src/react-app/components/form/ProcedureForm";
import { FieldError } from "@src/react-app/components/form/fields/FieldError";
import { defaultFormValuesForNode } from "@src/react-app/components/form/utils";
import React, { useState } from "react";
import { type Control, useController, useWatch } from "react-hook-form";
import { Field } from "../Field";

let currentKeyCount = 0;

export function ArrayField({
  name,
  label,
  control,
  node,
}: {
  name: string;
  label: string;
  control: Control<any>;
  node: ParsedInputNode & { type: "array" };
}) {
  const { field, fieldState } = useController({
    name,
    control,
  });
  // To make sure text field state dies when they're deleted
  const [textFieldKeys, setTextFieldKeys] = useState<string[]>([]);

  // For some ungodly reason RHF doesn't update field.value when the child fields update the value in the form
  // state. Each of the changes end up being reflected in the form state so they end up overwriting eachother and stuff.
  // Anyways, useWatch always has the real form state, so we just use it. So ArrayField will always rerender any time
  // the form state changes.
  const watch = useWatch({ control });

  function getValueFromWatch() {
    let r = watch;
    for (const p of [ROOT_VALS_PROPERTY_NAME].concat(
      node.path.map((e) => `${e}`),
    )) {
      r = r[p];
    }
    return r;
  }

  function onAddClick() {
    setTextFieldKeys((old) => old.concat([`${currentKeyCount++}`]));
    field.onChange(
      getValueFromWatch().concat([defaultFormValuesForNode(node.childType)]),
    );
  }

  function onDeleteClick(index: number) {
    const newArr = [...getValueFromWatch()];
    const newKeysArr = [...textFieldKeys];
    newArr.splice(index, 1);
    newKeysArr.splice(index, 1);
    field.onChange(newArr);
    setTextFieldKeys(newKeysArr);
  }
  return (
    <InputGroupContainer
      iconElement={<DataArray className="mr-1" />}
      title={label}
    >
      {field.value.map((parsedNode: ParsedInputNode, i: number) => (
        <span
          key={`${JSON.stringify(parsedNode.path)} ${i}`}
          className="flex flex-row items-start"
        >
          <span className="flex flex-1 flex-col">
            <Field
              key={textFieldKeys[i]}
              inputNode={{
                ...node.childType,
                // Need to calculate path dynamically since
                // it includes an array index and node.childType.path is always
                // an empty array
                path: node.path.concat([`${i}`]),
              }}
              control={control}
            />
          </span>
          <button
            type="button"
            className="ml-2"
            onClick={() => onDeleteClick(i)}
          >
            <XIcon className="mt-[0.45rem] mr-2 h-5 w-5" />
          </button>
        </span>
      ))}
      <AddItemButton onClick={onAddClick} />
      {fieldState.error?.message && (
        <FieldError errorMessage={fieldState.error.message} />
      )}
    </InputGroupContainer>
  );
}
