import { ChangeEvent } from "react";

import { useTranslation } from "next-i18next";

import ArrowRight from "assets/icons/arrow-right";

import ReactSelect from "components/react-select";

import { SelectOption } from "types/utils";

interface IntervalFiltersViewProps {
  intervals: SelectOption[];
  interval: SelectOption;
  startDate: string;
  endDate: string;
  onIntervalChange: (value: SelectOption) => void;
  onStartDateChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onEndDateChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function IntervalFiltersView({
  intervals,
  interval,
  startDate,
  endDate,
  onIntervalChange,
  onStartDateChange,
  onEndDateChange,
}: IntervalFiltersViewProps) {
  const { t } = useTranslation("common");

  return (
    <div className="row align-items-center">
      <div className="col-3">
        <div className="row align-items-center gx-2">
          <div className="col-auto">
            <label className="text-capitalize text-white font-weight-normal caption-medium">
              {t("misc.latest")}
            </label>
          </div>

          <div className="col">
            <ReactSelect
              options={intervals}
              value={interval}
              onChange={onIntervalChange}
              isSearchable={false}
            />
          </div>
        </div>
      </div>

      <div className="col">
        <div className="row align-items-center gx-2">
          <div className="col-auto">
            <label className="text-capitalize text-white font-weight-normal caption-medium">
              {t("profile:payments.period")}
            </label>
          </div>

          <div className="col">
            <input
              type="date"
              key="startDate"
              className="form-control"
              onChange={onStartDateChange}
              value={startDate}
              max={endDate}
            />
          </div>

          <div className="col-auto">
            <ArrowRight height="10px" width="10px" />
          </div>

          <div className="col">
            <input
              type="date"
              key="endDate"
              className="form-control"
              onChange={onEndDateChange}
              value={endDate}
              min={startDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
