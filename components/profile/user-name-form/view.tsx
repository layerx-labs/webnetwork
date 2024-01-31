import React from "react";

import { useTranslation } from "next-i18next";

import ApprovedIcon from "assets/icons/approved-icon";
import InfoIconEmpty from "assets/icons/info-icon-empty";

import Button from "components/button";
import If from "components/If";
import UserNameWithEditIcon from "components/profile/user-name-with-edit-icon/view";
import ResponsiveWrapper from "components/responsive-wrapper";

import { UserhandleInvalid } from "./controller";

type UserNameFormViewProps = {
  userhandle: string;
  sessionUserhandle: string;
  isEditting: boolean;
  isSaveButtonDisabled: boolean;
  validity: UserhandleInvalid;
  isExecuting: boolean;
  isApproved: boolean;
  onChange: (e) => void;
  onEditClick: (e: boolean) => void;
  onSave: () => void;
}

export default function UserNameFormView({
  userhandle,
  sessionUserhandle,
  isEditting,
  isSaveButtonDisabled,
  validity,
  isExecuting,
  isApproved,
  onChange,
  onEditClick,
  onSave,
}: UserNameFormViewProps) {
  const { t } = useTranslation(["common", " profile"]);

  function InvalidMessage() {
    return (
      <If condition={validity?.invalid}>
        <div className="d-flex align-items-center gap-1 mt-1">
          <InfoIconEmpty className="text-danger" width="13px" />{" "}
          <small className="xs-small text-danger">
            {validity?.text}
          </small>
        </div>
      </If>
    );
  }

  return (
    <div className="row my-3 align-items-center gap-2 gap-lg-0">
      <If
        condition={isEditting}
        otherwise={
          <UserNameWithEditIcon
            userName={sessionUserhandle || "User-Handle"}
            onEditClick={() => onEditClick(true)}
          />
        }
      >
        <div className="col-12 col-lg-4">
          <div className="input-group user-input border-radius-4">
            <input
              type="text"
              className={`form-control xl-semibold ${
                validity?.invalid ? "is-invalid" : ""
              }`}
              value={userhandle}
              data-testid="user-name-edit-input"
              onChange={onChange}
              disabled={isExecuting}
            />
            <If condition={isApproved}>
              <div className="d-flex bg-gray-850 align-items-center pe-3">
                <ApprovedIcon />
              </div>
            </If>
          </div>
        </div>
        <ResponsiveWrapper xl={false} xs={true}>
          <InvalidMessage />
        </ResponsiveWrapper>
        <div className="col-12 col-lg-auto">
          <div className="row mx-0">
            <Button
              onClick={onSave}
              disabled={isSaveButtonDisabled}
              isLoading={isExecuting}
              data-testid='user-name-save-button'
            >
              {t("actions.save")}
            </Button>
          </div>
        </div>
        <ResponsiveWrapper xl={true} xs={false}>
          <InvalidMessage />
        </ResponsiveWrapper>
      </If>
    </div>
  );
}