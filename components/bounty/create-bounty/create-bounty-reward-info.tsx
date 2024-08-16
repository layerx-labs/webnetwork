import { ChangeEvent, ReactNode } from "react";
import { Form } from "react-bootstrap";

import { useTranslation } from "next-i18next";

import BountyLabel from "components/bounty/create-bounty/create-bounty-label";
import Button from "components/button";

export default function CreateBountyRewardInfo({
  isFunding = false,
  updateIsFunding,
  children,
  multipleWinners,
  onMultipleWinnersChecked,
}: {
  isFunding?: boolean;
  updateIsFunding?: (e: boolean) => void;
  children: ReactNode;
  multipleWinners: boolean;
  onMultipleWinnersChecked: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  const { t } = useTranslation(["bounty"]);

  const descriptions = [
    t("descriptions.reward-1"),
    t("descriptions.reward-2")
  ]

  return (
    <div className="mt-2">
      <h5>{t("steps.reward")}</h5>
      <div className="text-gray">
        {t("descriptions.reward")}
        {descriptions?.map((value, key) => (
          <p key={key} className={`d-flex ${key === 0 ? 'mt-2': ''} ms-1`}>{key+1}.&nbsp;<p>{value}</p></p>
        ))}
      </div>

      <div className="row mb-3">
        <div className="col">
          <div className="row mt-3 align-items-center">
            <div className="col-auto">
              <label>
                {t("multiple-winners")}
              </label>
            </div>

            <div className="col-auto">
              <Form.Check
                className="form-control-md mb-1"
                type="switch"
                id="multiple-winners-switch"
                data-testid="multiple-winners-switch"
                onChange={onMultipleWinnersChecked}
                checked={multipleWinners}
              />
            </div>
          </div>

          <div className="row mt-2">
            <span className="sm-regular text-gray-200">
              {t("multiple-winners-description")}
            </span>
          </div>
        </div>
      </div>

      <>
        <div className="d-flex">
          <label>{t("fields.reward-type")}</label>
          <div className="mx-1 text-danger">*</div>
        </div>
        <div className="d-flex mt-1">
          <Button
            className={!isFunding ? "bounty-button" : "bounty-outline-button"}
            onClick={() => updateIsFunding(false)}
            data-testid="self-fund-btn"
          >
            {t("self-fund")}
          </Button>
          <Button
            className={isFunding ? "bounty-button" : "bounty-outline-button"}
            onClick={() => updateIsFunding(true)}
            data-testid="seek-funding-btn"
          >
            {t("seek-funding")}
          </Button>
        </div>
      </>
      <>{children}</>
    </div>
  );
}
