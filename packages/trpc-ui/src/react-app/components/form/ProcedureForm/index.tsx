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
import { z } from "zod";
import { useAsyncDuration } from "../../hooks/useAsyncDuration";
import { AutoFillIcon } from "../../icons/AutoFillIcon";
import JSONEditor from "../JSONEditor";
import { ErrorDisplay as ErrorComponent } from "./Error";
import { FormSection } from "./FormSection";
import { ProcedureFormButton } from "./ProcedureFormButton";
import { Response } from "./Response";

const TRPCErrorSchema = z.object({
  meta: z.object({
    responseJSON: z
      .array(
        z.object({
          error: z.object({
            json: z.object({
              code: z.number(),
              data: z.object({
                code: z.string(),
                httpStatus: z.number(),
                stack: z.string().optional(),
              }),
              message: z.string().optional(),
            }),
          }),
        }),
      )
      .min(1),
  }),
});

export type TRPCErrorType = z.infer<typeof TRPCErrorSchema>;

function isTrpcError(error: unknown): error is TRPCErrorType {
  const parse = TRPCErrorSchema.safeParse(error);
  return parse.success;
}

export const ROOT_VALS_PROPERTY_NAME = "vals";

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
  // null => request was never sent
  // undefined => request successful but nothing returned from procedure
  const [response, setResponse] = useState<any>(null);
  const { duration, loading, measureAsyncDuration } = useAsyncDuration();
  const formRef = useRef<HTMLFormElement | null>(null);
  const utils = trpc.useUtils();
  const { mutateAsync } = getUtilsOrProcedure(trpc, procedure).useMutation();
  const fetchFunction = getUtilsOrProcedure(utils, procedure).fetch;

  const {
    control,
    reset: resetForm,
    handleSubmit,
    getValues,
    setValue,
  } = useForm({
    resolver: ajvResolver(wrapJsonSchema(procedure.inputSchema as any), {
      formats: fullFormats,
    }),
    defaultValues: {
      [ROOT_VALS_PROPERTY_NAME]: defaultFormValuesForNode(procedure.node),
    },
  });
  async function onSubmit(data: { [ROOT_VALS_PROPERTY_NAME]: any }) {
    let newData: any;
    if (options.transformer === "superjson") {
      newData = SuperJson.serialize(data[ROOT_VALS_PROPERTY_NAME]);
    } else {
      newData = { ...data[ROOT_VALS_PROPERTY_NAME] };
    }
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
                  <XButton control={control} reset={resetForm} />
                  <div className="h-6 w-6">
                    <button
                      type="button"
                      onClick={() => {
                        setValue("vals", sample(procedure.inputSchema));
                      }}
                    >
                      <AutoFillIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <ToggleRawInput onClick={toggleRawInput} />
                </div>
              }
            >
              {useRawInput && (
                <JSONEditor
                  value={getValues().vals}
                  onChange={(values) => {
                    setValue("vals", values);
                  }}
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
            (isTrpcError(response) ? (
              <ErrorComponent error={response} />
            ) : (
              <Response
                time={duration ?? undefined}
                size={getSize(JSON.stringify(response))}
              >
                {response}
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

function wrapJsonSchema(jsonSchema: any) {
  const { $schema, ...rest } = jsonSchema;

  return {
    type: "object",
    properties: {
      [ROOT_VALS_PROPERTY_NAME]: rest,
    },
    required: [],
    additionalProperties: false,
    $schema: "http://json-schema.org/draft-07/schema#",
  };
}
