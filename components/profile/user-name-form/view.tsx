import React from "react";

import { useTranslation } from "next-i18next";

import Button from "components/button";
import If from "components/If";
import UserNameWithEditIcon from "components/profile/user-name-with-edit-icon/view";
import ResponsiveWrapper from "components/responsive-wrapper";

interface UserNameFormProps {
  userName: string;
  isEditUserName: boolean;
  isSaveButtonDisabled: boolean;
  isEmailInvalid: boolean;
  isExecuting: boolean;
  onHandleUserNameChange: (e) => void;
  onHandleEditUserName: (e: boolean) => void;
  onSave: () => void;
}

export default function UserNameForm({
  userName,
  isEditUserName,
  isSaveButtonDisabled,
  isEmailInvalid,
  isExecuting,
  onHandleUserNameChange,
  onHandleEditUserName,
  onSave,
}: UserNameFormProps) {
  const { t } = useTranslation(["common", " profile"]);

  return (
    <div className="row my-3 align-items-center gap-2 gap-lg-0">
      <If
        condition={isEditUserName}
        otherwise={
          <UserNameWithEditIcon
            userName="User-Handle"
            onHandleOnClick={() => onHandleEditUserName(true)}
          />
        }
      >
        <div className="col-12 col-lg-4">
          <input
            type="text"
            className={`form-control xl-semibold user-input ${
              isEmailInvalid ? "is-invalid" : ""
            }`}
            value={userName}
            onChange={onHandleUserNameChange}
            disabled={isExecuting}
          />
        </div>
        <ResponsiveWrapper xl={false} xs={true}>
          <If condition={isEmailInvalid}>
            <small className="xs-small text-danger">
              {t("profile:invalid-user-name")}
            </small>
          </If>
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
          <If condition={isEmailInvalid}>
            <small className="xs-small text-danger">
              {t("profile:invalid-user-name")}
            </small>
          </If>
        </ResponsiveWrapper>
      </If>
    </div>
  );
}
