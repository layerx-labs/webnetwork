import React from "react";

import { useTranslation } from "next-i18next";

import Button from "components/button";
import Switch from "components/common/switch/view";
import If from "components/If";
import ResponsiveWrapper from "components/responsive-wrapper";

interface NotificationFormProps {
  userEmail: string;
  isNotificationEnabled: boolean;
  isSaveButtonDisabled: boolean;
  isSwitchDisabled: boolean;
  isEmailInvalid: boolean;
  isConfirmationPending: boolean;
  isExecuting: boolean;
  emailVerificationError: string;
  onHandleEmailChange: (e) => void;
  onSave: () => void;
  onResend: () => void;
  onSwitchChange: (value: boolean) => void;
}

export default function NotificationForm({
  userEmail,
  isNotificationEnabled,
  isSaveButtonDisabled,
  isSwitchDisabled,
  isEmailInvalid,
  isConfirmationPending,
  isExecuting,
  emailVerificationError,
  onHandleEmailChange,
  onSave,
  onResend,
  onSwitchChange,
}: NotificationFormProps) {
  const { t } = useTranslation(["common", " profile"]);

  return (
    <div className="row mb-4 mt-4">
      <div className="col-12 col-lg-8">
        <div className="d-flex align-items-center justify-content-between mb-1">
          <span className="base-medium text-white">
            {t("profile:notifications-form.title")}
          </span>

          <Switch
            value={isNotificationEnabled}
            onChange={onSwitchChange}
            disabled={isSwitchDisabled}
          />
        </div>

        <div className="row">
          <span className="text-gray-500 xs-medium font-weight-normal">
            {t("profile:notifications-form.message")}
          </span>
        </div>

        <If condition={isNotificationEnabled}>
          <div className="row mt-3 align-items-center gap-2 gap-lg-0">
            <div className="col-12 col-lg-6">
              <input
                type="text"
                className={`form-control ${isEmailInvalid ? "is-invalid" : ""}`}
                value={userEmail}
                onChange={onHandleEmailChange}
                disabled={isExecuting}
              />
            </div>
            <ResponsiveWrapper lg={false} xs={true}>
              <If condition={isEmailInvalid}>
                <small className="xs-small text-danger">
                  {t("profile:notifications-form.invalid-email")}
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
            <ResponsiveWrapper lg={true} xs={false}>
              <If condition={isEmailInvalid}>
                <small className="xs-small text-danger">
                  {t("profile:notifications-form.invalid-email")}
                </small>
              </If>
            </ResponsiveWrapper>
          </div>

          <If condition={!!emailVerificationError}>
            <div className="row align-items-center mt-3">
              <div className="col-6">
                <small className="xs-medium text-danger">
                  {t(`profile:email-errors.${emailVerificationError}`)}
                </small>
              </div>

              <div className="col-auto">
                <Button
                  onClick={onResend}
                  disabled={isExecuting || !emailVerificationError}
                  isLoading={emailVerificationError && isExecuting}
                >
                  {t("profile:notifications-form.re-send")}
                </Button>
              </div>
            </div>
          </If>

          <If condition={isConfirmationPending && !emailVerificationError}>
            <div className="row align-items-center mt-3">
              <div className="col">
                <span className="text-info xs-medium font-weight-normal">
                  {t("profile:notifications-form.re-send-email")}
                </span>
              </div>
            </div>
          </If>
        </If>
      </div>
    </div>
  );
}
