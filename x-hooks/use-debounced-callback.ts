import { useRef, useCallback } from "react";

export default function useDebouncedCallback(callback: () => void, time: number) {
  const timeout = useRef(null);

  return useCallback(() => {
    const later = () => {
      clearTimeout(timeout.current);
      callback();
    };

    clearTimeout(timeout.current);
    timeout.current = setTimeout(later, time);
  }, [callback, time]);
}