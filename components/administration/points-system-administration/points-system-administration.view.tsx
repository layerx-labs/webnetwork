import { NumberFormatValues } from "react-number-format";

import { UseMutateFunction } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useTranslation } from "next-i18next";

import { Header } from "components/administration/points-system-administration/points-system-administration.controller";
import Button from "components/button";
import { Divider } from "components/divider";
import InputNumber from "components/input-number";
import { Table } from "components/table/table.controller";

import { PointsBase } from "interfaces/points-system";

type PointsSystemAdministrationViewProps = {
  headers: Header[];
  list: PointsBase[];
  scalingFactor: number;
  isUpdateButtonDisabled: boolean;
  isBulkUpdating: boolean;
  isSaveChangesButtonDisabled: boolean;
  isUpdatingChanged: boolean;
  onScalingFactorChange: (values: NumberFormatValues) => void;
  onBulkUpdateClick: UseMutateFunction<PointsBase[], unknown, unknown, unknown>;
  onSaveChangedClick: UseMutateFunction<PointsBase[], AxiosError<{ message: string; }, unknown>, unknown, unknown>;
  onRowChange: (row: PointsBase) => void;
}

export function PointsSystemAdministrationView({
  headers,
  list,
  scalingFactor,
  isUpdateButtonDisabled,
  isBulkUpdating,
  isSaveChangesButtonDisabled,
  isUpdatingChanged,
  onScalingFactorChange,
  onBulkUpdateClick,
  onSaveChangedClick,
  onRowChange,
}: PointsSystemAdministrationViewProps) {
  const { t } = useTranslation("administration");

  return(
    <div className="pt-3">
      <span>{t("points-system.change-scaling-factor")}</span>
      <div className="row align-items-center mb-4">
        <div className="col">
          <InputNumber
            value={scalingFactor}
            onValueChange={onScalingFactorChange}
            min={1}
            decimalScale={2}
          />
        </div>

        <div className="col">
          <Button
            disabled={isUpdateButtonDisabled}
            isLoading={isBulkUpdating}
            onClick={onBulkUpdateClick}
          >
            {t("points-system.update-all")}
          </Button>
        </div>
      </div>

      <Divider />

      <div className="row align-items-center justify-content-end">
        <div className="col col-md-auto">
          <div className="row mx-0">
            <Button
              disabled={isSaveChangesButtonDisabled}
              isLoading={isUpdatingChanged}
              onClick={onSaveChangedClick}
              className="mb-3"
            >
              {t("points-system.save-changes")}
            </Button>
          </div>
        </div>
      </div>

      <Table
        variant="dark"
        borderless
        bordered
        responsive
        headers={headers}
        rows={list}
        editableColumns={["scalingFactor", "pointsPerAction", "counter"]}
        onRowChange={onRowChange}
      />
    </div>
  );
}