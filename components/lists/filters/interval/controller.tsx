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
import { useRouter } from "next/router";

import IntervalFiltersView from "components/lists/filters/interval/view";

import { IntervalFiltersProps } from "types/components";
import { SelectOption } from "types/utils";

import useQueryFilter from "x-hooks/use-query-filter";

export default function IntervalFilters({
  defaultInterval,
  intervals,
  intervalIn = "days",
  direction = "horizontal",
}: IntervalFiltersProps) {
  const { t } = useTranslation(["common"]);
  const router = useRouter();

  const [interval, setInterval] = useState<number>(defaultInterval);

  const { value, setValue } = useQueryFilter({ startDate: null, endDate: null });

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

  useEffect(() => {
    if (!router?.query?.wallet || (router?.query?.startDate && router?.query?.endDate)) return;

    setValue(getIntervalDates(defaultInterval), true);
  }, [router?.query]);

  return(
    <IntervalFiltersView
      intervals={intervals.map(intervalToOption)}
      interval={intervalToOption(interval)}
      startDate={value.startDate}
      endDate={value.endDate}
      onIntervalChange={onIntervalChange}
      onStartDateChange={onDateChange("startDate")}
      onEndDateChange={onDateChange("endDate")}
      direction={direction}
    />
  );
}
