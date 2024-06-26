import clsx from "clsx";

import HorizontalScroll from "components/horizontal-scroll/controller";

import { MiniTabsItem } from "types/components";

interface ScrollableTabsProps {
  tabs: MiniTabsItem[];
}

export default function ScrollableTabs({ tabs }: ScrollableTabsProps) {
  return (
    <div className="row w-100 border-bottom border-gray-850 mx-0">
      <HorizontalScroll>
        {tabs.map((item) => (
          <div key={item.label} data-testid={item.label} className="w-auto px-0 me-5 cursor-pointer">
            <div
              className={clsx([
                "font-weight-medium py-2",
                item.active
                  ? "text-white border-bottom border-primary"
                  : "text-gray-500",
              ])}
              onClick={item.onClick}
              data-testid={`tab-${item.label}`}
            >
              <span>{item.label}</span>
            </div>
          </div>
        ))}
      </HorizontalScroll>
    </div>
  );
}
