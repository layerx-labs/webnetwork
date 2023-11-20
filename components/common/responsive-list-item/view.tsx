import { ReactNode } from "react";

import clsx from "clsx";

import ResponsiveListItemColumn from "components/common/responsive-list-item/column/view";
import If from "components/If";
import ResponsiveWrapper from "components/responsive-wrapper";

import { ResponsiveListItemColumnProps } from "types/components";

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
      <div className="col-sm-12 col-md px-0">
        <div className="row align-items-center">
          <div className="col-auto">
            {icon}
          </div>

          <div className="col px-0">
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="caption-small overflow-wrap-anywhere font-weight-medium text-white">
                  {label}
                </span>
              </div>

              <If condition={!!secondaryLabel}>
                <div className="col-auto mt-2 px-0">
                  {secondaryLabel}
                </div>
              </If>
            </div>

            <If condition={!!thirdLabel}>
              <div className="mt-2">
                {thirdLabel}
              </div>
            </If>

            <If condition={!!mobileColumns}>
              <div className="d-flex flex-column">
                {mobileColumns.map(col =>
                  <ResponsiveListItemColumn
                    {...col}
                    justify="start"
                    breakpoints={{ xs: true, md: false }}
                  />)}
              </div>
            </If>
            <If condition={!!action}>
              <ResponsiveWrapper className={`mt-2`} xs={true} md={false}>
                {action}
              </ResponsiveWrapper>
            </If>
          </div>
        </div>
      </div>

      {columns?.map((column, index) => <ResponsiveListItemColumn key={`list-item-${index}`} {...column} />)}

      <If condition={!!action}>
        <ResponsiveWrapper
          className={`col d-flex flex-row align-items-center justify-content-center`}
          xs={false}
          md={true}
        >
          <div className="d-flex ms-3">
            {action}
          </div>
        </ResponsiveWrapper>
      </If>
    </div>
  );
}
