import Button from "components/button";

import TrashIcon from "../../../../assets/icons/trash-icon";

interface PermissionsItemProps {
  value: string;
  id: number;
  label?: string;
  onTrashClick: (v: string) => void;
  disabled?: boolean;
}

export default function PermissionListItem ({
  value,
  id,
  onTrashClick,
  label,
  disabled
}: PermissionsItemProps) {
  const CARD_CLASS = "bg-gray-900 border border-gray-800 border-radius-4 py-2 px-3";

  return (
    <div className="col-12 col-md-5">
      <div
        className={`row mb-2 mx-0 align-items-center justify-content-between ${CARD_CLASS}`}
        key={`${value}-${id}`}
      >
        <div className="col p px-0">
          {label || value}
        </div>
        <div className="col-auto px-0">
          <Button
            color="gray-800"
            className="not-svg p-1 border border-gray-700 border-radius-4"
            onClick={() => onTrashClick(value)}
            disabled={disabled}
            data-testid={`permission-item-button-${value}`}
          >
            <TrashIcon/>
          </Button>
        </div>
      </div>
    </div>
  );
}
