import {Spinner} from "react-bootstrap";

import {format} from "date-fns";
import {useTranslation} from "next-i18next";

import CaretLeftIcon from "assets/icons/caret-left";
import CaretRightIcon from "assets/icons/caret-right";

import Button from "components/button";

import {PointsEvents} from "../../../../../interfaces/points";
import {PointsBadge} from "../../../../common/points/points-badge.view";
import If from "../../../../If";
import NothingFound from "../../../../nothing-found";

export interface PageElement {
  label: number | string;
  isSeparator?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

interface MyPointsHistoryViewProps { 
  history: PointsEvents[];
  loading: boolean;
  page: number;
  pages: PageElement[];
  onPreviousClick: () => void;
  onNextClick: () => void;
}

export function MyPointsHistoryView({
  history, 
  loading,
  page,
  pages,
  onPreviousClick,
  onNextClick,
}: MyPointsHistoryViewProps) {
  const {t} = useTranslation("points");
  const ph = (path: string) => t(`points-history.${path}`);

  return <div className="row border border-radius-8 border-gray-800 mt-4 mx-0">
    <div className="col">
      <div className="row px-3 py-2 xs-medium font-weight-600">
        <div className="col col-4">{ph("action")}</div>
        <div className="col col-3 text-center">{ph("points")}</div>
        <div className="col col-2 text-center">{ph("status")}</div>
        <div className="col col-3 d-flex justify-content-end">{ph("date")}</div>
      </div>

      {
        loading
          ? <div className="row border-top border-gray-800 pt-3 pb-2">
            <div className="col text-center">
              <Spinner className="p-2 my-1" animation="border"/>
            </div>
          </div>
          : null
      }

      <If condition={!loading && !history?.length}>
        <div className="row border-top border-gray-800 pt-3 pb-2">
          <div className="mtn-3">
            <NothingFound description={ph("no-points")} />
          </div>
        </div>
      </If>

      {
        history.map((entry, i) =>
          <div className="row border-top p-3 text-gray-400 border-gray-800 align-items-center xs-medium" key={i}>
            <div className="col col-4 font-weight-500"><strong>{ph(`actionName.${entry.actionName}`)}</strong></div>
            <div className="col col-3 d-flex justify-content-center">
              <PointsBadge size="sm" points={entry.pointsWon}/>
            </div>
            <div className="col col-2 text-center font-weight-500">
              {ph(`state.${entry.pointsCounted ? "counted" : "pending"}`)}
            </div>
            <div className="col col-3 d-flex justify-content-end font-weight-400">
              {format(new Date(entry.createdAt), "dd/MM/yyyy")}
            </div>
          </div>)
      }

      <div className="row justify-content-center align-items-center py-2 border-top border-gray-800">
        <div className="col-auto">
          <Button
            transparent
            className="p-2 bg-gray-950 border-radius-4 not-svg"
            textClass="text-primary"
            onClick={onPreviousClick}
          >
            <CaretLeftIcon height={14} width={14} />
          </Button>
        </div>

        {
          pages
            .map((pageElement, i) => (
              <div className="col-auto" key={`page-${pageElement.label}=${i}`}>
                <Button
                  transparent
                  className={`p-2 border-radius-4 
                    ${pageElement.isActive ? "text-white" : "text-gray-600 text-white-hover"}`}
                  onClick={pageElement.onClick}
                >
                  <span className="xs-medium">
                    {pageElement.label}
                  </span>
                </Button>
              </div>
            ))
        }

        <div className="col-auto">
          <Button
            transparent
            className="p-2 bg-gray-950 border-radius-4 not-svg"
            textClass="text-primary"
            onClick={onNextClick}
          >
            <CaretRightIcon height={14} width={14} />
          </Button>
        </div>
      </div>
    </div>
  </div>
}