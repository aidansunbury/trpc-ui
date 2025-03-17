import { ajvResolver } from "@hookform/resolvers/ajv";
import type { ParsedInputNode } from "@src/parse/parseNodeTypes";
import type { ParsedProcedure } from "@src/parse/parseProcedure";
import { CollapsableSection } from "@src/react-app/components/CollapsableSection";
import { Field } from "@src/react-app/components/form/Field";
import { DocumentationSection } from "@src/react-app/components/form/ProcedureForm/DescriptionSection";
import { ProcedureFormContextProvider } from "@src/react-app/components/form/ProcedureForm/ProcedureFormContext";
import { ObjectField } from "@src/react-app/components/form/fields/ObjectField";
import { defaultFormValuesForNode } from "@src/react-app/components/form/utils";
import { CloseIcon } from "@src/react-app/components/icons/CloseIcon";
import { ToggleJsonIcon } from "@src/react-app/components/icons/ToggleJsonIcon";
import { trpc } from "@src/react-app/trpc";
import type { RenderOptions } from "@src/render";
import { sample } from "@stoplight/json-schema-sampler";

import { fullFormats } from "ajv-formats/dist/formats";
import React, { useRef, useState } from "react";
import { type Control, useForm, useFormState } from "react-hook-form";
import getSize from "string-byte-length";
import SuperJson from "superjson";
import { useAsyncDuration } from "../../hooks/useAsyncDuration";
import { AutoFillIcon } from "../../icons/AutoFillIcon";

import Editor from "@monaco-editor/react";
import { ErrorDisplay as ErrorComponent } from "./Error";
import { FormSection } from "./FormSection";
import { ProcedureFormButton } from "./ProcedureFormButton";
import { Response } from "./Response";

export const ROOT_VALS_PROPERTY_NAME = "vals";

const wrapSuperJson = (json: JSON, usingSuperJson: boolean) => {
  if (!usingSuperJson) {
    return json;
  }

  return {
    json: json,
    meta: {
      values: {},
    },
  };
};

interface JSONSchemaType {
  type: string;
  properties?: Record<string, JSONSchemaType>;
  required?: string[];
  format?: string;
  [key: string]: any;
}

// Recurse down the path to get the function to call
function getUtilsOrProcedure(base: any, procedure: ParsedProcedure) {
  let cur = base;
  for (const p of procedure.pathFromRootRouter) {
    //@ts-ignore
    cur = cur[p];
  }
  return cur;
}

export function ProcedureForm({
  procedure,
  options,
  name,
}: {
  procedure: ParsedProcedure;
  options: RenderOptions;
  name: string;
}) {
  const usingSuperJson = options.transformer === "superjson";

  // null => request was never sent
  // undefined => request successful but nothing returned from procedure
  const [response, setResponse] = useState<{
    isError: boolean;
    response: any;
  } | null>(null);
  const { duration, loading, measureAsyncDuration } = useAsyncDuration({
    options,
  });
  const formRef = useRef<HTMLFormElement | null>(null);
  const utils = trpc.useUtils();
  const { mutateAsync } = getUtilsOrProcedure(trpc, procedure).useMutation();
  const fetchFunction = getUtilsOrProcedure(utils, procedure).fetch;
  const [shouldValidate, setShouldValidate] = useState(true);

  const {
    control,
    reset: resetForm,
    handleSubmit,
    watch,
    setValue,
  } = useForm({
    resolver: ajvResolver(
      shouldValidate
        ? wrapJsonSchema(procedure.inputSchema as any, {
            rootPropertyName: ROOT_VALS_PROPERTY_NAME,
            useSuperJson: usingSuperJson,
          })
        : {},
      {
        formats: fullFormats,
      },
    ),
    defaultValues: {
      [ROOT_VALS_PROPERTY_NAME]: wrapSuperJson(
        defaultFormValuesForNode(procedure.node),
        usingSuperJson,
      ),
    },
  });
  async function onSubmit(data: { [ROOT_VALS_PROPERTY_NAME]: any }) {
    const newData = data[ROOT_VALS_PROPERTY_NAME];

    const apiCaller =
      procedure.procedureType === "query" ? fetchFunction : mutateAsync;

    const result = await measureAsyncDuration(
      async () => await apiCaller(newData),
    );
    setResponse(result);
  }

  const fieldName = procedure.node.path.join(".");

  const [useRawInput, setUseRawInput] = useState(false);
  function toggleRawInput() {
    setUseRawInput(!useRawInput);
  }

  return (
    <ProcedureFormContextProvider path={procedure.pathFromRootRouter.join(".")}>
      <CollapsableSection
        titleElement={
          <span className="flex flex-row items-center font-bold text-lg">
            {name}
          </span>
        }
        fullPath={procedure.pathFromRootRouter}
        sectionType={procedure.procedureType}
        focusOnScrollRef={formRef}
      >
        <form
          className="flex flex-col space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          ref={formRef}
        >
          <div className="flex flex-col">
            <DocumentationSection extraData={procedure.extraData} />

            <FormSection
              title="Input"
              topRightElement={
                <div className="flex space-x-1">
                  {useRawInput && usingSuperJson && (
                    <a
                      href="https://github.com/aidansunbury/trpc-ui#superjson-example-and-usage"
                      className="hover:underline"
                      target="blank"
                    >
                      Why do I see "json" and "meta" keys? ↗
                    </a>
                  )}
                  <XButton control={control} reset={resetForm} />
                  <div className="h-6 w-6">
                    <button
                      type="button"
                      onClick={() => {
                        setValue(
                          ROOT_VALS_PROPERTY_NAME,
                          wrapSuperJson(
                            sample(procedure.inputSchema),
                            usingSuperJson,
                          ),
                        );
                      }}
                    >
                      <AutoFillIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <ToggleRawInput onClick={toggleRawInput} />
                  <label className="flex flex-row items-center">
                    <input
                      checked={shouldValidate}
                      onChange={() => setShouldValidate((prev) => !prev)}
                      className="mr-2 size-5"
                      type="checkbox"
                    />
                    Validate Input on Client
                  </label>
                </div>
              }
            >
              {useRawInput && (
                <Editor
                  defaultLanguage="json"
                  options={{
                    minimap: {
                      enabled: false,
                    },
                    formatOnType: true,
                  }}
                  height={"30vh"}
                  value={JSON.stringify(
                    watch(ROOT_VALS_PROPERTY_NAME),
                    null,
                    2,
                  )}
                  onChange={(value) =>
                    setValue(ROOT_VALS_PROPERTY_NAME, JSON.parse(value ?? "{}"))
                  }
                />
              )}
              {!useRawInput &&
                (procedure.node.type === "object" ? (
                  Object.keys(procedure.node.children).length > 0 && (
                    <ObjectField
                      node={
                        procedure.node as ParsedInputNode & {
                          type: "object";
                        }
                      }
                      label={fieldName}
                      control={control}
                      topLevel
                    />
                  )
                ) : (
                  <Field inputNode={procedure.node} control={control} />
                ))}

              <ProcedureFormButton
                text={`Execute ${name}`}
                colorScheme={"neutral"}
                loading={loading}
              />
            </FormSection>
          </div>
        </form>
        <div className="flex flex-col space-y-4">
          {response &&
            (response.isError ? (
              <>
                <ErrorComponent error={response.response} />
              </>
            ) : (
              <Response
                time={duration ?? undefined}
                size={
                  usingSuperJson
                    ? getSize(SuperJson.stringify(response.response))
                    : getSize(JSON.stringify(response.response))
                }
              >
                {response.response}
              </Response>
            ))}
        </div>
      </CollapsableSection>
    </ProcedureFormContextProvider>
  );
}

function XButton({
  control,
  reset,
}: {
  control: Control<any>;
  reset: () => void;
}) {
  const { isDirty } = useFormState({ control: control });

  function onClickClear() {
    reset();
  }

  return (
    <div className="h-6 w-6">
      {isDirty && (
        <button type="button" onClick={onClickClear}>
          <CloseIcon className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}

function ToggleRawInput({ onClick }: { onClick: () => void }) {
  return (
    <div className="h-6 w-6">
      <button type="button" onClick={onClick}>
        <ToggleJsonIcon className="h-6 w-6" />
      </button>
    </div>
  );
}

function wrapJsonSchema(
  jsonSchema: JSONSchemaType,
  options: {
    rootPropertyName: string;
    useSuperJson?: boolean;
  },
): JSONSchemaType {
  const { rootPropertyName, useSuperJson = false } = options;

  // Extract and remove $schema to only place it at the top level
  const { $schema, ...schemaWithoutDollarSchema } = jsonSchema;
  const finalSchema = $schema || "http://json-schema.org/draft-07/schema#";

  let wrappedSchema: JSONSchemaType;

  if (useSuperJson) {
    // For SuperJSON structure, we're expecting:
    // vals -> { json -> actual_schema, meta -> {...} }

    wrappedSchema = {
      type: "object",
      properties: {
        [rootPropertyName]: {
          type: "object",
          properties: {
            json: schemaWithoutDollarSchema,
            meta: {
              type: "object",
              properties: {
                values: {
                  type: "object",
                },
              },
            },
          },
          required: ["json"],
          additionalProperties: true,
        },
      },
      required: [rootPropertyName],
      additionalProperties: true,
    };
  } else {
    // If not using SuperJSON, just wrap under the root property
    wrappedSchema = {
      type: "object",
      properties: {
        [rootPropertyName]: schemaWithoutDollarSchema,
      },
      required: [rootPropertyName],
      additionalProperties: true,
    };
  }

  // Add $schema only at the top level
  wrappedSchema.$schema = finalSchema;

  return wrappedSchema;
}
