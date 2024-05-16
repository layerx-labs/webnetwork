import {format} from "date-fns";
import {useTranslation} from "next-i18next";

import {PointsHistory} from "../../../../../types/pages";

export function MyPointsHistoryView({history}: {history: PointsHistory}) {
  const { t } = useTranslation(["profile"]);
  const ph = (path: string) => t(`points-history.${path}`);

  return <>
    <div className="row px-3 mt-4 mb-2">
      <div className="col col-4">{ph("action")}</div>
      <div className="col col-3">{ph("points")}</div>
      <div className="col col-2">{ph("status")}</div>
      <div className="col col-2 d-flex justify-content-end">{ph("date")}</div>
      <div className="col col-1"></div>
    </div>
    {
      history.map((entry, i) =>
        <div className="row mb-2 border-radius-8 p-3 bg-gray-900 border-gray-800" key={i}>
          <div className="col col-4 font-weight-600"><strong>{ph(`actionName.${entry.actionName}`)}</strong></div>
          <div className="col col-3">{entry.pointsWon}</div>
          <div className="col col-2">{ph(`state.${entry.pointsCounted?"counted":"pending"}`)}</div>
          <div className="col col-2 d-flex justify-content-end">{format(new Date(entry.updatedAt), "dd/MM/yyyy")}</div>
          <div className="col col-1"></div>
        </div>)
    }
  </>
}