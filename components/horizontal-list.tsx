import { ReactNode, useRef, useState } from "react";

import ChevronLeftIcon from "assets/icons/chevronleft-icon";
import ChevronRightIcon from "assets/icons/chevronright-icon";

import Button from "components/button";
import If from "components/If";

import useMouseHold from "x-hooks/use-mouse-hold";

interface HorizontalListProps {
  children?: ReactNode;
  className?: string;
}

export default function HorizontalList({
  children,
  className
}: HorizontalListProps) {
  const divRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const CLICK_STEP = 100;
  const HOLD_STEP = 2;

  function handleScroll(direction: "left" | "right", isClick) {
    if (divRef.current) {
      const step = isClick ? CLICK_STEP : HOLD_STEP;

      const newScrollValue = divRef.current.scrollLeft + (direction === "left" ? -step : step);
      const maxScroll = divRef.current.scrollWidth - divRef.current.clientWidth;

      if (direction === "left" && newScrollValue >= 0 || direction === "right" && newScrollValue <= maxScroll) {
        divRef.current.scrollLeft = newScrollValue;

        setCanScrollLeft(newScrollValue > 0);
        setCanScrollRight(newScrollValue < maxScroll);
      }
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
      <If condition={canScrollLeft}>
        <Button 
          className="leftButton p-0 rounded-0 h-100 border-0 d-xl-none" 
          onClick={clickLeft}
          {...eventsLeft}
        >
          <ChevronLeftIcon />
        </Button>
      </If>
      
      <div className={`d-flex flex-nowrap overflow-auto ${className} overflow-noscrollbar`} ref={divRef}>
        {children}
      </div>

      <If condition={canScrollRight}>
        <Button 
          className="rightButton p-0 rounded-0 h-100 border-0 d-xl-none" 
          onClick={clickRight}
          {...eventsRight}
        >
          <ChevronRightIcon />
        </Button>
      </If>
    </div>
  );
}