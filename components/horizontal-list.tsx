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

  const HOLD_STEP = 2;

  function updateCanScroll() {
    if (divRef.current) {
      const scrollValue = divRef.current.scrollLeft;
      const maxScroll = divRef.current.scrollWidth - divRef.current.clientWidth;

      setCanScrollLeft(scrollValue > 0);
      setCanScrollRight(scrollValue < maxScroll);
    }
  }

  function handleScroll(direction: "left" | "right") {
    return(() => {
      if (divRef.current) {
        const newScrollValue = divRef.current.scrollLeft + (direction === "left" ? -HOLD_STEP : HOLD_STEP);
        const maxScroll = divRef.current.scrollWidth - divRef.current.clientWidth;

        console.log({ newScrollValue, maxScroll, direction, scrollLeft: divRef.current.scrollLeft })
  
        if (direction === "left" && newScrollValue >= 0 || direction === "right" && newScrollValue <= maxScroll)
          divRef.current.scrollLeft = newScrollValue;

        updateCanScroll();
      }
    });
  }

  const mouseEventsLeft = useMouseHold(handleScroll("left"), { forceStop: !canScrollLeft });
  const mouseEventsRight = useMouseHold(handleScroll("right"), { forceStop: !canScrollRight });

  return(
    <div className="horizontal-list" onTouchMove={updateCanScroll}>
      {canScrollLeft &&
        <Button 
          className="leftButton p-0 rounded-0 h-100 border-0 d-xl-none"
          {...mouseEventsLeft}
        >
          <ChevronLeftIcon />
        </Button>
      }
      
      <div className={`d-flex flex-nowrap overflow-auto ${className} overflow-noscrollbar`} ref={divRef}>
        {children}
      </div>

      <If condition={canScrollRight}>
        <Button 
          className="rightButton p-0 rounded-0 h-100 border-0 d-xl-none"
          {...mouseEventsRight}
        >
          <ChevronRightIcon />
        </Button>
      </If>
    </div>
  );
}