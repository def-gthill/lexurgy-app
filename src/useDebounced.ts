import _ from "lodash";
import { useCallback, useRef } from "react";

export default function useDebounced<P extends any[], R>(
  f: (...args: P) => R,
  wait: number
): (...args: P) => R {
  const debouncedRef = useRef(_.debounce(f, wait));

  const debouncedFunction = useCallback(
    (...args: P) => debouncedRef.current(...args)!,
    [debouncedRef]
  );

  return debouncedFunction;
}
