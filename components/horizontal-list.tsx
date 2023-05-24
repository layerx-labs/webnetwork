import { ReactNode, useEffect, useRef, useState } from "react";

import ChevronLeftIcon from "assets/icons/chevronleft-icon";
import ChevronRightIcon from "assets/icons/chevronright-icon";

import Button from "components/button";
import If from "components/If";

import useMouseHold from "x-hooks/use-mouse-hold";

interface HorizontalListProps {
  children?: ReactNode;
  className?: string;
}

type Direction = "left" | "right";

export default function HorizontalList({
  children,
  className
}: HorizontalListProps) {
  const divRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const HOLD_STEP = 2;

  function updateCanScroll(direction: Direction) {
    return((entries) => {
      const { isIntersecting } = entries.shift();
      
      if (direction === "left") setCanScrollLeft(!isIntersecting);
      else setCanScrollRight(!isIntersecting);
    });
  }

  function handleScroll(direction: Direction) {
    return(() => {
      if (divRef.current) {
        const newScrollValue = divRef.current.scrollLeft + (direction === "left" ? -HOLD_STEP : HOLD_STEP);
        const maxScroll = divRef.current.scrollWidth - divRef.current.clientWidth;
  
        if (direction === "left" && newScrollValue >= 0 || direction === "right" && newScrollValue <= maxScroll)
          divRef.current.scrollLeft = newScrollValue;
      }
    });
  }

  function getObserver(cb) {
    return new IntersectionObserver(cb, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0
    });
  }

  const mouseEventsLeft = useMouseHold(handleScroll("left"), { forceStop: !canScrollLeft });
  const mouseEventsRight = useMouseHold(handleScroll("right"), { forceStop: !canScrollRight });

  useEffect(() => {
    const leftObserver = getObserver(updateCanScroll("left"));
    const rightObserver = getObserver(updateCanScroll("right"));

    const childs = divRef.current ? [...divRef.current.children] : [];
    const firstChild = childs.length ? childs.shift() : null;
    const lastChild = childs.length ? childs.pop() : null;

    if (firstChild) leftObserver.observe(firstChild);
    if (lastChild) rightObserver.observe(lastChild);

    return () => {
      if (firstChild) leftObserver.unobserve(firstChild);
      if (lastChild) rightObserver.unobserve(lastChild);
    };
  }, []);

  return(
    <div className="horizontal-list">
      <If condition={canScrollLeft}>
        <Button 
          className="leftButton p-0 rounded-0 h-100 border-0 d-xl-none"
          {...mouseEventsLeft}
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
          {...mouseEventsRight}
        >
          <ChevronRightIcon />
        </Button>
      </If>
    </div>
  );
}