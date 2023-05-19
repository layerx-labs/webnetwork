import { useRef } from "react";

export default function useMouseHold(fn, delay = 5) {
  const intervalRef = useRef(null);

  function onHold() {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      fn();
    }, delay);
  }

  function onUp() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  return {
    onMouseDown: onHold,
    onTouchStart: onHold,
    onMouseUp: onUp,
    onMouseLeave: onUp,
    onTouchEnd: onUp
  }
}