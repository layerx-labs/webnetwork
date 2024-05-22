import {PointsHistory} from "../../../../../types/pages";
import {MyPointsHistoryView} from "./my-points-history.view";

export function MyPointsHistory({history}: {history: PointsHistory}) {

  return <MyPointsHistoryView history={history} />
}