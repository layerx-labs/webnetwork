import { Tooltip } from "components/common/tooltip/tooltip.view";

import { HeaderColumn } from "types/components";

interface ListHeaderProps {
  columns: HeaderColumn[];
}

export default function ListHeader({
  columns
}: ListHeaderProps) {
  function renderListBarColumn(column: HeaderColumn, key: number) {
    const LabelWrapper = ({ children }) => 
      column?.tip ? <Tooltip tip={column?.tip}>{children}</Tooltip> : <>{children}</>;

    return (
      <div
      key={`${key}-${column?.label}`}
      className={`d-flex flex-row col justify-content-center align-items-center text-gray`}
      >
        <LabelWrapper>
          <span className="xs-medium text-uppercase text-center gray-150">{column?.label}</span>
        </LabelWrapper>
      </div>
    );
  }

  return (
    <div className="row pb-0 pt-2 mb-2 svg-with-text-color">
      {columns?.map(renderListBarColumn)}
    </div>
  );
}
