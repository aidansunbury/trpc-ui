import type { Info } from "@src/render";
import React from "react";
import Markdown from "react-markdown";

export function MetaHeader({ meta }: { meta?: Info }) {
  if (!meta) {
    return null;
  }
  const { title, description } = meta;
  return (
    <header>
      {title && <h1 className="pb-2 font-bold text-5xl">{title}</h1>}
      {description && (
        <article className="prose !max-w-none">
          <Markdown className="w-full">{description}</Markdown>
        </article>
      )}
    </header>
  );
}
