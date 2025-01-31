import { useState } from "react";
import { parseError } from "../form/utils";
import type { RenderOptions } from "@src/render";
import SuperJSON from "superjson";

export function useAsyncDuration({ options }: { options: RenderOptions }) {
  const [duration, setDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const measureAsyncDuration = async <T,>(asyncFunction: () => Promise<T>) => {
    setLoading(true);
    const startTime = performance.now();
    let endTime = startTime;
    try {
      const result = await asyncFunction();
      endTime = performance.now();
      const parsed =
        options.transformer === "superjson"
          ? SuperJSON.deserialize(result)
          : result;

      return { isError: false, response: parsed };
    } catch (error) {
      endTime = performance.now();
      const parsed = parseError(error, options.transformer === "superjson");
      return {
        isError: parsed.isError,
        response: parsed.data,
      };
    } finally {
      setDuration(endTime - startTime);
      setLoading(false);
    }
  };

  return { duration, loading, measureAsyncDuration };
}
