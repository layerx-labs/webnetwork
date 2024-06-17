import {userPointsOfUser} from "../../../../../x-hooks/use-points-of-user";
import {MyPointsHistoryView} from "./my-points-history.view";

export function MyPointsHistory() {
  const {collectedPoints, fetchingCollectedPoints} = userPointsOfUser();
  return <MyPointsHistoryView loading={fetchingCollectedPoints} history={collectedPoints} />
}