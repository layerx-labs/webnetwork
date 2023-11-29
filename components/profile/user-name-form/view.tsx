import React from "react";

import { useTranslation } from "next-i18next";

import ApprovedIcon from "assets/icons/approved-icon";
import InfoIconEmpty from "assets/icons/info-icon-empty";

import Button from "components/button";
import If from "components/If";
import UserNameWithEditIcon from "components/profile/user-name-with-edit-icon/view";
import ResponsiveWrapper from "components/responsive-wrapper";

import { UserNameInvalid } from "./controller";

type UserNameFormViewProps = {
  userName: string;
  sessionUserName: string;
  isEditUserName: boolean;
  isSaveButtonDisabled: boolean;
  userNameInvalid: UserNameInvalid;
  isExecuting: boolean;
  isApprovedName: boolean;
  onHandleUserNameChange: (e) => void;
  onHandleEditUserName: (e: boolean) => void;
  onSave: () => void;
}

export default function UserNameFormView({
  userName,
  sessionUserName,
  isEditUserName,
  isSaveButtonDisabled,
  userNameInvalid,
  isExecuting,
  isApprovedName,
  onHandleUserNameChange,
  onHandleEditUserName,
  onSave,
}: UserNameFormViewProps) {
  const { t } = useTranslation(["common", " profile"]);

  function InvalidMessage() {
    return (
      <If condition={userNameInvalid?.invalid}>
        <div className="d-flex align-items-center gap-1 mt-1">
          <InfoIconEmpty className="text-danger" width="13px" />{" "}
          <small className="xs-small text-danger">
            {userNameInvalid?.text}
          </small>
        </div>
      </If>
    );
  }

  return (
    <div className="row my-3 align-items-center gap-2 gap-lg-0">
      <If
        condition={isEditUserName}
        otherwise={
          <UserNameWithEditIcon
            userName={sessionUserName || "User-Handle"}
            onHandleOnClick={() => onHandleEditUserName(true)}
          />
        }
      >
        <div className="col-12 col-lg-4">
          <div className="input-group user-input border-radius-4">
            <input
              type="text"
              className={`form-control xl-semibold ${
                userNameInvalid?.invalid ? "is-invalid" : ""
              }`}
              value={userName}
              onChange={onHandleUserNameChange}
              disabled={isExecuting}
            />
            <If condition={isApprovedName}>
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