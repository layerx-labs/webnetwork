import { useState } from "react";

import { AxiosError } from "axios";
import { useTranslation } from "next-i18next";

import { PointsSystemAdministrationView } 
  from "components/administration/points-system-administration/points-system-administration.view";

import { QueryKeys } from "helpers/query-keys";

import { PointsBase } from "interfaces/points-system";

import { useBulkUpdatePointsBase, useGetPointsBase } from "x-hooks/api/points";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import useReactQuery from "x-hooks/use-react-query";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";

export type Header = {
  label: string,
  property: keyof PointsBase,
}

export function PointsSystemAdministration() {
  const { t } = useTranslation("administration");

  const [list, setList] = useState<PointsBase[]>([]);
  const [scalingFactor, setScalingFactor] = useState();
  const [changedRows, setChangedRows] = useState<PointsBase[]>([]);

  const { addError, addSuccess } = useToastStore();
  
  useReactQuery(QueryKeys.pointsBase(), async () => {
    const data = await useGetPointsBase();
    setList(data);
    return data;
  });

  function getUpdateMethod(type: "bulk" | "changed") {
    const rows = {
      bulk: list.map(({ id, actionName }) => ({ id, actionName, scalingFactor })),
      changed: changedRows
    }[type];

    return async () => useBulkUpdatePointsBase({
      rows,
    });
  }

  const { mutate: hanleBulkUpdate, isPending: isBulkUpdating } = useReactQueryMutation({
    queryKey: QueryKeys.pointsBase(),
    mutationFn: getUpdateMethod("bulk"),
    onSettled: (data, error) => {
      if (error) {
        addError(t("failed"), t("points-system.scaling-factor-greater-than-0"));
        return;
      }
      addSuccess(t("success"), t("points-system.scaling-factor-updated"));
      setScalingFactor(null);
    },
  });

  const { mutate: handleChangedUpdate, isPending: isUpdatingChanged } = useReactQueryMutation({
    queryKey: QueryKeys.pointsBase(),
    mutationFn: getUpdateMethod("changed"),
    onSettled: (data, error: AxiosError<{ message: string }>) => {
      if (error) {
        addError(t("failed"), `${error?.response?.data?.message}`);
        return;
      }
      addSuccess(t("success"), t("points-system.changed-rules-updated"));
      setChangedRows([]);
    }
  });

  const headers: Header[] = [
    { label: t("points-system.action-name"), property: "actionName" },
    { label: t("points-system.scaling-factor"), property: "scalingFactor" },
    { label: t("points-system.points-per-action"), property: "pointsPerAction" },
    { label: t("points-system.counter"), property: "counter" },
  ];

  const onScalingFactorChange = values => setScalingFactor(values.value);
  const isUpdateButtonDisabled = !scalingFactor || isBulkUpdating || !list?.length || isUpdatingChanged;
  const isSaveChangesButtonDisabled = !changedRows?.length || isUpdatingChanged || isBulkUpdating;

  function onRowChange(row: PointsBase) {
    setChangedRows(previous => {
      const tmp = [...previous];
      const index = tmp.findIndex(i => i.id === row.id);
      if (index > -1)
        tmp[index] = row;
      else
        tmp.push(row);
      return tmp;
    });
    setList(previous => {
      const tmp = [...previous];
      const index = tmp.findIndex(i => i.id === row.id);
      tmp[index] = row;
      return tmp;
    });
  }

  return(
    <PointsSystemAdministrationView
      headers={headers}
      list={list}
      scalingFactor={scalingFactor}
      isUpdateButtonDisabled={isUpdateButtonDisabled}
      isBulkUpdating={isBulkUpdating}
      isSaveChangesButtonDisabled={isSaveChangesButtonDisabled}
      isUpdatingChanged={isUpdatingChanged}
      onScalingFactorChange={onScalingFactorChange}
      onBulkUpdateClick={hanleBulkUpdate}
      onSaveChangedClick={handleChangedUpdate}
      onRowChange={onRowChange}
    />
  );
}