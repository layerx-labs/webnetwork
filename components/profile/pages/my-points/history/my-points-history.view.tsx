import {format} from "date-fns";
import {useTranslation} from "next-i18next";

import {PointsEvents} from "../../../../../interfaces/points";
import {PointsBadge} from "../../../../common/points/points-badge.view";

export function MyPointsHistoryView({history}: {history: PointsEvents[]}) {
  const { t } = useTranslation("points");
  const ph = (path: string) => t(`points-history.${path}`);

  return <div className="row border border-radius-8 border-gray-800 mt-4 ">
    <div className="col">
      <div className="row px-3 py-2 xs-medium font-weight-600">
        <div className="col col-4">{ph("action")}</div>
        <div className="col col-3 text-center">{ph("points")}</div>
        <div className="col col-2 text-center">{ph("status")}</div>
        <div className="col col-3 d-flex justify-content-end">{ph("date")}</div>
      </div>
        {
          history.reverse().map((entry, i) =>
            <div className="row border-top p-3 text-gray-400 border-gray-800 align-items-center xs-medium" key={i}>
              <div className="col col-4 font-weight-500"><strong>{ph(`actionName.${entry.actionName}`)}</strong></div>
              <div className="col col-3 d-flex justify-content-center"><PointsBadge size="sm" points={entry.pointsWon}/></div>
              <div
                className="col col-2 text-center font-weight-500">{ph(`state.${entry.pointsCounted ? "counted" : "pending"}`)}</div>
              <div
                className="col col-3 d-flex justify-content-end font-weight-400">{format(new Date(entry.updatedAt || entry.createdAt), "dd/MM/yyyy")}</div>
            </div>)
        }
    </div>
  </div>
}