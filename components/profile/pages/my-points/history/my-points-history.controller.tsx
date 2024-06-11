import {PointsHistory} from "../../../../../types/pages";
import {userPointsOfUser} from "../../../../../x-hooks/use-points-of-user";
import {MyPointsHistoryView} from "./my-points-history.view";

export function MyPointsHistory({history}: {history: PointsHistory}) {
  const {collectedPoints} = userPointsOfUser();
  return <MyPointsHistoryView history={collectedPoints} />
}