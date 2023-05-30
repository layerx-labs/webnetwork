import { useRef, useCallback } from "react";

export default function useDebouncedCallback(callback: (...args) => void, time: number) {
  const timeout = useRef(null);

  return useCallback((...args) => {
    const later = () => {
      clearTimeout(timeout.current);
      callback(...args);
    };

    clearTimeout(timeout.current);
    timeout.current = setTimeout(later, time);
  }, [callback, time]);
}