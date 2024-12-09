import React, { useState } from "react";
import { ChevronIcon } from "../../icons/ChevronIcon";

export function StackTrace({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-gray-500 bg-gray-50 shadow-sm">
      <button
        className="flex flex-row items-center justify-between rounded-t-md bg-gray-100 bg-white p-4 font-bold"
        onClick={() => setOpen((val) => !val)}
        type="button"
      >
        Stack Trace{" "}
        <ChevronIcon
          className={`ml-2 h-4 w-4 ${!open ? "rotate-180" : "-rotate-90"}`}
        />
      </button>
      {open && (
        <div className="max-h-64 overflow-scroll whitespace-pre bg-light p-4">
          {text}
        </div>
      )}
    </div>
  );
}
