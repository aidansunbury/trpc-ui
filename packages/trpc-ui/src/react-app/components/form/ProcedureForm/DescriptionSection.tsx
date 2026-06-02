import type { ProcedureExtraData } from "@src/parse/parseProcedure";
import { FormLabel } from "@src/react-app/components/form/FormLabel";
import { FormSection } from "@src/react-app/components/form/ProcedureForm/FormSection";
import { type ReactNode } from "react";
import Markdown from "react-markdown";
export function DocumentationSection({
  extraData,
}: {
  extraData: ProcedureExtraData;
}) {
  const hasParams = Object.keys(extraData.parameterDescriptions).length > 0;
  if (!extraData.description && !hasParams) return null;

  return (
    <FormSection title="Docs">
      <div className="space-y-4">
        {extraData.description && (
          <DocumentationSubsection title="Description">
            <article className="prose">
              <Markdown>{extraData.description}</Markdown>
            </article>
          </DocumentationSubsection>
        )}
        {hasParams && (
          <DocumentationSubsection title="Params">
            <table>
              <tbody>
                {Object.entries(extraData.parameterDescriptions).map(
                  ([key, value]) => (
                    <tr
                      key={key}
                      className="flex-row space-x-2 border-separator-line border-b"
                    >
                      <td className="py-2 align-top font-bold text-neutral-text text-sm">
                        {`${key}: `}
                      </td>
                      <td className="py-2 pl-4 text-gray-500 text-sm">
                        <article className="prose">
                          <Markdown>{value}</Markdown>
                        </article>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </DocumentationSubsection>
        )}
      </div>
    </FormSection>
  );
}

function DocumentationSubsection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col space-y-2">
      <FormLabel>{title}</FormLabel>
      <span className="text-gray-500 text-sm">{children}</span>
    </div>
  );
}
