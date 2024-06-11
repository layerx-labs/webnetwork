import {PointsBase} from "interfaces/points-system";

import {api} from "services/api";

type BulkUpdatePayload = {
  rows: {
    id: number;
    scalingFactor?: number;
    pointsPerAction?: number;
    counter?: string;
  }[]
}

export async function useBulkUpdatePointsBase(payload: BulkUpdatePayload): Promise<PointsBase[]> {
  return api.put("/points/base/bulk-update", payload);
}