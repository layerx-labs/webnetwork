import { ReactNode, useRef } from "react";

import ChevronLeftIcon from "assets/icons/chevronleft-icon";
import ChevronRightIcon from "assets/icons/chevronright-icon";

import useMouseHold from "x-hooks/use-mouse-hold";

import Button from "./button";

interface HorizontalListProps {
  children?: ReactNode;
  className?: string;
}

export default function HorizontalList({
  children,
  className
}: HorizontalListProps) {
  const divRef = useRef(null);

  const CLICK_STEP = 50;
  const HOLD_STEP = 2;

  function handleScroll(direction: "left" | "right", isClick) {
    const step = isClick ? CLICK_STEP : HOLD_STEP;

    if (divRef.current) {
      const newScrollValue = divRef.current.scrollLeft + (direction === "left" ? -step : step);
      const maxScroll = divRef.current.scrollWidth - divRef.current.clientWidth;

      if (direction === "left" && newScrollValue >= 0 || direction === "right" && newScrollValue <= maxScroll)
        divRef.current.scrollLeft = newScrollValue;
    }
  }

  function clickRight() {
    handleScroll("right", true);
  }

  function scrollRight() {
    handleScroll("right", false);
  }

  function clickLeft() {
    handleScroll("left", true);
  }

  function scrollLeft() {
    handleScroll("left", false);
  }

  const eventsLeft = useMouseHold(scrollLeft);
  const eventsRight = useMouseHold(scrollRight);

  return(
    <div className="horizontal-list">
      <Button 
        className="leftButton p-0 rounded-0 h-100" 
        onClick={clickLeft}
        {...eventsLeft}
      >
        <ChevronLeftIcon />
      </Button>
      
      <div className={`d-flex flex-nowrap overflow-auto ${className} overflow-noscrollbar`} ref={divRef}>
        {children}
      </div>

      <Button 
        className="rightButton p-0 rounded-0 h-100" 
        onClick={clickRight}
        {...eventsRight}
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
}