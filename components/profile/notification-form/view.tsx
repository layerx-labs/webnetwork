import React from "react";

import {useTranslation} from "next-i18next";

import InfoIconEmpty from "assets/icons/info-icon-empty";

import Button from "components/button";
import Switch from "components/common/switch/view";
import If from "components/If";
import ResponsiveWrapper from "components/responsive-wrapper";

import { NotificationSettings } from "interfaces/user-notification";

interface NotificationFormViewProps {
  userEmail: string;
  isNotificationEnabled: boolean;
  isSaveButtonDisabled: boolean;
  isSwitchDisabled: boolean;
  isInvalid: boolean;
  isConfirmationPending: boolean;
  isExecuting: boolean;
  emailVerificationError: string;
  notificationSettings: Partial<NotificationSettings>;
  onChange: (e) => void;
  onSave: () => void;
  onResend: () => void;
  onSwitchChange: (value: boolean) => void;
  toggleNotificationItem: (key: keyof NotificationSettings) => void;
}

export default function NotificationFormView({
  userEmail,
  isNotificationEnabled,
  isSaveButtonDisabled,
  isSwitchDisabled,
  isInvalid,
  isConfirmationPending,
  isExecuting,
  emailVerificationError,
  notificationSettings,
  onChange,
  onSave,
  onResend,
  onSwitchChange,
  toggleNotificationItem,
}: NotificationFormViewProps) {
  const { t } = useTranslation(["common", " profile"]);

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="row align-items-end gap-2 gap-lg-0">
          <div className="col-12 col-lg-4">
            <div className="base-medium text-white mb-2">
              {t("profile:email")}
            </div>

            <input
              type="text"
              className={`form-control ${isInvalid ? "is-invalid" : ""}`}
              data-testid="email-input"
              value={userEmail}
              onChange={onChange}
              disabled={isExecuting}
            />
          </div>

          <ResponsiveWrapper lg={false} xs={true}>
            <If condition={isInvalid}>
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
                data-testid="notification-save-btn">
                {t("actions.save")}
              </Button>
            </div>
          </div>

          <ResponsiveWrapper lg={true} xs={false}>
            <If condition={isInvalid}>
              <div className="d-flex align-items-center gap-1 mt-1">
                <InfoIconEmpty className="text-danger" width="13px"/>{" "}
                <small className="xs-small text-danger">
                  {t("profile:notifications-form.invalid-email")}
                </small>
              </div>
            </If>
          </ResponsiveWrapper>
        </div>

        <If condition={!!emailVerificationError}>
          <div className="row align-items-center mt-2">
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
                data-testid="notification-re-send-btn"
              >
                {t("profile:notifications-form.re-send")}
              </Button>
            </div>
          </div>
        </If>

        <If condition={isConfirmationPending && !emailVerificationError}>
          <div className="row align-items-center mt-2">
            <div className="col">
                <span className="text-info xs-medium font-weight-normal">
                  {t("profile:notifications-form.re-send-email")}
                </span>
            </div>
          </div>
        </If>
      </div>

      <div className="row align-items-center mt-3">
        <div className="d-flex col justify-content-between align-items-center">
          <div className="mr-1">
            <div className="base-medium text-white mb-1">{t("profile:notifications-form.title")}</div>

            <div className="text-gray-500 xs-medium font-weight-normal">
              {t("profile:notifications-form.message")}
            </div>
          </div>

          <Switch
            value={isNotificationEnabled}
            onChange={onSwitchChange}
            disabled={isSwitchDisabled}
          />
        </div>
      </div>

      <If condition={isNotificationEnabled}>
        <div className="row mt-2">
          <div className="col-12 col-md-6">
            <div className="row align-items-center gy-3">
              {Object.keys(notificationSettings).map(key => (
                <div className="col-12 col-md-6" key={key}>
                  <div className="d-flex align-items-center gap-1">
                    <Switch
                      value={notificationSettings[key]}
                      onChange={() => toggleNotificationItem(key as keyof NotificationSettings)}
                      disabled={isSwitchDisabled}
                    />

                    <span className="xs-medium text-white mt-1">
                      {t(`profile:notification-settings.${key}`)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </If>
    </div>
  );
}