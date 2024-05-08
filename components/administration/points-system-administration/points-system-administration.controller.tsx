import { useState } from "react";

import Button from "components/button";
import InputNumber from "components/input-number";
import { Table } from "components/table/table.controller";

import { QueryKeys } from "helpers/query-keys";

import { PointsBase } from "interfaces/points-system";

import { useBulkUpdatePointsBase, useGetPointsBase } from "x-hooks/api/points";
import useReactQuery from "x-hooks/use-react-query";
import useReactQueryMutation from "x-hooks/use-react-query-mutation";

type Header = {
  label: string,
  property: keyof PointsBase,
}

export function PointsSystemAdministration() {
  const [list, setList] = useState<PointsBase[]>([]);
  const [scalingFactor, setScalingFactor] = useState();
  
  const { data: pointsBase } = useReactQuery(QueryKeys.pointsBase(), async () => {
    const data = await useGetPointsBase();
    setList(data);
    return data;
  });
  const { mutate: hanleBulkUpdate, isPending: isBulkUpdating } = useReactQueryMutation({
    queryKey: QueryKeys.pointsBase(),
    mutationFn: async () => {
      return useBulkUpdatePointsBase({
        rows: list.map(({ id }) => ({ id, scalingFactor })),
      });
    },
    onSuccess: () => setScalingFactor(null)
  });

  const headers: Header[] = [
    { label: "Action Name", property: "actionName" },
    { label: "Scaling Factor", property: "scalingFactor" },
    { label: "Points per Action", property: "pointsPerAction" },
    { label: "Counter", property: "counter" },
  ];

  const onScalingFactorChange = values => setScalingFactor(values.value);
  const isUpdateButtonDisabled = !scalingFactor || isBulkUpdating || !list?.length;

  return(
    <div className="pt-3">
      <span>Change Scaling Factor</span>
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
            onClick={hanleBulkUpdate}
          >
            Update All
          </Button>
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
      />
    </div>
  );
}