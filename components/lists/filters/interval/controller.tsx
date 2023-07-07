import { ChangeEvent, useState, useEffect } from "react";

import {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  format,
  parseISO,
  subDays,
  subMonths,
  subYears,
} from "date-fns";
import { useTranslation } from "next-i18next";

import ArrowRight from "assets/icons/arrow-right";

import ReactSelect from "components/react-select";

import { SelectOption } from "types/utils";

import useQueryFilter from "x-hooks/use-query-filter";

interface IntervalListFilterProps {
  defaultInterval?: number;
  intervals: number[];
  intervalIn?: "days" | "months" | "years";
}

export default function IntervalListFilter({
  defaultInterval,
  intervals,
  intervalIn = "days",
}: IntervalListFilterProps) {
  const { t } = useTranslation(["common"]);

  const [interval, setInterval] = useState<number>(defaultInterval);

  const { value, setValue } = useQueryFilter(["startDate", "endDate"]);

  const now = new Date();

  function getIntervalDates(interval) {
    const formatDate = (date) => format(date, "yyyy-MM-dd").toString();
    const subFn = {
      days: subDays,
      months: subMonths,
      years: subYears,
    }[intervalIn];

    return {
      startDate: formatDate(subFn(new Date(), interval)),
      endDate: formatDate(now),
    };
  }

  function onIntervalChange({ value }: SelectOption) {
    setInterval(+value);
    const { startDate, endDate } = getIntervalDates(value);

    setValue({ startDate, endDate }, true);
  }

  function onDateChange(dateParam: string) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      setValue({
        [dateParam]: e.target.value,
      }, true);
    };
  }

  const intervalToOption = (interval: number): SelectOption =>
    interval ? {
      value: interval,
      label: t(`info-data.${intervalIn}WithCount`, { count: interval }),
    } : null;

  useEffect(() => {
    if (defaultInterval) setValue(getIntervalDates(defaultInterval), true);
  }, []);

  useEffect(() => {
    const diffFn = {
      days: differenceInDays,
      months: differenceInMonths,
      years: differenceInYears,
    }[intervalIn];

    const diff = diffFn(parseISO(value.endDate), parseISO(value.startDate));
    const isExistentInterval = intervals.includes(diff);

    setInterval(isExistentInterval ? diff : null);
  }, [value]);

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
              options={intervals.map(intervalToOption)}
              value={intervalToOption(interval)}
              onChange={onIntervalChange}
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
              onChange={onDateChange("startDate")}
              value={value.startDate}
              max={value.endDate}
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
              onChange={onDateChange("endDate")}
              value={value.endDate}
              min={value.startDate}
              max={format(now, "yyyy-MM-dd").toString()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
