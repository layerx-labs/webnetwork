import {ReactNode} from "react";

import clsx from "clsx";

import ResponsiveListItemColumn from "components/common/responsive-list-item/column/view";
import If from "components/If";
import {ResponsiveEle} from "components/responsive-wrapper";

import {ResponsiveListItemColumnProps} from "types/components";

interface NetworkListItemProps {
  onClick?: () => void;
  icon: ReactNode;
  label: ReactNode;
  secondaryLabel?: ReactNode;
  thirdLabel?: ReactNode;
  columns: ResponsiveListItemColumnProps[];
  mobileColumnIndex?: number | number[];
  action?: ReactNode;
}

export default function ResponsiveListItem({
  onClick,
  icon,
  label,
  secondaryLabel,
  thirdLabel,
  columns,
  mobileColumnIndex = 0,
  action,
}: NetworkListItemProps) {
  const mobileColumns = columns?.filter((col, index) => [].concat(mobileColumnIndex).includes(index));

  return (
    <div 
      className={clsx([
        "p-3 row border-radius-4 bg-gray-850 mx-0 align-items-center",
        !!onClick && "cursor-pointer",
      ])} 
      onClick={onClick}
    >
      <div className="col-sm-12 col-md mw-md-25">
        <div className="row align-items-center">
          <div className="col-auto">
            {icon}
          </div>

          <div className="col text-truncate px-0">
            <div className="row align-items-center">
              <div className="col-auto text-truncate">
                <span className="caption-small font-weight-medium text-white" data-testid={label}>
                  {label}
                </span>
              </div>
            </div>

            <If condition={!!secondaryLabel}>
              <div className="row align-items-center">
                <div className="col-auto mt-2">
                  {secondaryLabel}
                </div>
              </div>
            </If>

            <If condition={!!thirdLabel}>
              <div className="mt-2">
                {thirdLabel}
              </div>
            </If>

            <If condition={!!mobileColumns}>
              <div className="d-flex flex-column">
                {mobileColumns.map(col =>
                  <ResponsiveListItemColumn
                    key={`col-${col?.label}`}
                    {...col}
                    justify="start"
                    breakpoints={{ xs: true, md: false }}
                  />)}
              </div>
            </If>
            <If condition={!!action}>
              <div className="mt-xs-2 mt-md-0">
                <ResponsiveEle tabletView={null} mobileView={action} />
              </div>
            </If>
          </div>
        </div>
      </div>

      {columns?.map((column, index) => <ResponsiveListItemColumn key={`list-item-${index}`} {...column} />)}

      <If condition={!!action}>
        <div className="d-none d-md-flex col flex-row align-items-center justify-content-center">
          <div className="d-flex ms-3">
            {action}
          </div>
        </div>
      </If>

    </div>
  );
}
