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
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { fullFormats } from "ajv-formats/dist/formats";
import React, { useEffect, useRef, useState } from "react";
import { type Control, useForm, useFormState } from "react-hook-form";
import getSize from "string-byte-length";
import SuperJson from "superjson";
import { z } from "zod";
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
  const [mutationResponse, setMutationResponse] = useState<any>(null);
  const [queryEnabled, setQueryEnabled] = useState<boolean>(false);
  const [queryInput, setQueryInput] = useState<any>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const context = trpc.useContext();
  const [startTime, setStartTime] = useState<number | undefined>();
  const [opDuration, setOpDuration] = useState<number | undefined>();

  function getProcedure() {
    let cur: typeof trpc | (typeof trpc)[string] = trpc;
    for (const p of procedure.pathFromRootRouter) {
      // TODO - Maybe figure out these typings?
      //@ts-ignore
      cur = cur[p];
    }
    return cur;
  }

  const query = (() => {
    const router = getProcedure();
    //@ts-ignore
    return router.useQuery(queryInput, {
      enabled: queryEnabled,
      initialData: null,
      retry: false,
      refetchOnWindowFocus: false,
    });
  })() as UseQueryResult<any>;

  function invalidateQuery(input: any) {
    let cur: any = context;
    for (const p of procedure.pathFromRootRouter) {
      cur = cur[p];
    }
    cur.invalidate(input);
  }

  const mutation = (() => {
    const router = getProcedure();
    //@ts-ignore
    return router.useMutation({
      retry: false,
      onSuccess: (data: unknown) => {
        if (startTime) setOpDuration(Date.now() - startTime);
        setStartTime(undefined);
      },
    });
  })() as UseMutationResult<any>;

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
  function onSubmit(data: { [ROOT_VALS_PROPERTY_NAME]: any }) {
    let newData: any;
    if (options.transformer === "superjson") {
      newData = SuperJson.serialize(data[ROOT_VALS_PROPERTY_NAME]);
    } else {
      newData = { ...data[ROOT_VALS_PROPERTY_NAME] };
    }
    if (procedure.procedureType === "query") {
      setQueryInput(newData);
      setQueryEnabled(true);
      invalidateQuery(newData);
    } else {
      setStartTime(Date.now());
      mutation.mutateAsync(newData).then(setMutationResponse).catch();
    }
  }

  // I've seen stuff online saying form reset should happen in useEffect hook only
  // not really sure though, gonna just leave it for now
  const [shouldReset, setShouldReset] = useState(false);
  useEffect(() => {
    if (shouldReset) {
      resetForm(
        { [ROOT_VALS_PROPERTY_NAME]: defaultFormValuesForNode(procedure.node) },
        {
          keepValues: false,
          keepDirtyValues: false,
          keepDefaultValues: false,
        },
      );
      setShouldReset(false);
    }
  }, [shouldReset, setShouldReset, resetForm, defaultFormValuesForNode]);
  function reset() {
    setShouldReset(true);
    setQueryEnabled(false);
  }

  let data: any;
  if (procedure.procedureType === "query") {
    data = query.data ?? null;
  } else {
    data = mutationResponse;
  }

  // Get raw size before deserialization
  const size = getSize(JSON.stringify(data));
  if (options.transformer === "superjson" && data) {
    data = SuperJson.deserialize(data);
  }
  const error =
    procedure.procedureType === "query" ? query.error : mutation.error;

  // Fixes the timing for queries, not ideal but works
  useEffect(() => {
    if (query.fetchStatus === "fetching") {
      setStartTime(Date.now());
    }
    if (query.fetchStatus === "idle") {
      setOpDuration(Date.now() - startTime);
    }
  }, [query.fetchStatus]);

  const fieldName = procedure.node.path.join(".");

  const [useRawInput, setUseRawInput] = useState(false);
  function toggleRawInput() {
    console.log(getValues());
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
                <div className="flex">
                  <XButton control={control} reset={reset} />
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
                loading={query.fetchStatus === "fetching" || mutation.isPending}
              />
            </FormSection>
          </div>
        </form>
        <div className="flex flex-col space-y-4">
          {data && (
            <Response size={size} time={opDuration}>
              {data}
            </Response>
          )}
          {!data && data !== null && (
            <Response>Successful request but no data was returned</Response>
          )}
          {error &&
            (isTrpcError(error) ? (
              <ErrorComponent error={error} />
            ) : (
              <Response>{error}</Response>
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
  jsonSchema.$schema = undefined;

  return {
    type: "object",
    properties: {
      [ROOT_VALS_PROPERTY_NAME]: jsonSchema,
    },
    required: [],
    additionalProperties: false,
    $schema: "http://json-schema.org/draft-07/schema#",
  };
}
