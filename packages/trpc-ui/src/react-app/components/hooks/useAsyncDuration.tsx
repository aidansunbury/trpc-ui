import { useState } from "react";

export function useAsyncDuration() {
  const [duration, setDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const measureAsyncDuration = async <T,>(
    asyncFunction: () => Promise<T>
  ): Promise<T> => {
    setLoading(true);
    const startTime = performance.now();

    try {
      const result = await asyncFunction();
      const endTime = performance.now();
      setDuration(endTime - startTime);
      return result;
    } finally {
      setLoading(false);
    }
  };

  return { duration, loading, measureAsyncDuration };
}



