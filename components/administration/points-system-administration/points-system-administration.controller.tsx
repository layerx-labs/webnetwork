import { useState } from "react";

import { AxiosError } from "axios";

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
  const [list, setList] = useState<PointsBase[]>([]);
  const [scalingFactor, setScalingFactor] = useState();
  const [changedRows, setChangedRows] = useState<PointsBase[]>([]);

  const { addError } = useToastStore();
  
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
        addError("Failed", "Scaling factor must be greater than 0");
        return;
      }
      setScalingFactor(null);
    },
  });

  const { mutate: handleChangedUpdate, isPending: isUpdatingChanged } = useReactQueryMutation({
    queryKey: QueryKeys.pointsBase(),
    mutationFn: getUpdateMethod("changed"),
    onSettled: (data, error: AxiosError<{ message: string }>) => {
      if (error) {
        addError("Failed", `${error?.response?.data?.message}`);
        return;
      }
      setChangedRows([]);
    }
  });

  const headers: Header[] = [
    { label: "Action Name", property: "actionName" },
    { label: "Scaling Factor", property: "scalingFactor" },
    { label: "Points per Action", property: "pointsPerAction" },
    { label: "Counter", property: "counter" },
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