import ItemAmount from "components/networks-list/item-amount";
import { ResponsiveEle } from "components/responsive-wrapper";

import { ResponsiveListItemColumnProps } from "types/components";

export default function ResponsiveListItemColumn(column: ResponsiveListItemColumnProps) {
  const Column = 
    <div className={`col d-flex flex-row align-items-center justify-content-${column?.justify || "start"}`}>
      <ItemAmount
        label={column?.label}
        amount={column?.secondaryLabel}
        currency={column?.currency}
      />
    </div>;
  const getVisibility = (visibility: boolean) =>  visibility ? Column : visibility === false ? null : undefined;

  return(
    <ResponsiveEle
      mobileView={getVisibility(column?.visibility?.mobile)}
      tabletView={getVisibility(column?.visibility?.tablet)}
      desktopView={getVisibility(column?.visibility?.desktop)}
    />
  );
}