import React from "react";

import { useTranslation } from "next-i18next";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import Badge from "components/badge";
import Button from "components/button";
import Switch from "components/common/switch/view";
import GithubConnectionState from "components/connections/github-connection-state/controller";
import CustomContainer from "components/custom-container";
import { Divider } from "components/divider";
import If from "components/If";
import AddressWithCopy from "components/profile/address-with-copy/controller";
import ProfileLayout from "components/profile/profile-layout";
import { RemoveGithubAccount } from "components/profile/remove-github-modal";
import ResponsiveWrapper from "components/responsive-wrapper";

import useBreakPoint from "x-hooks/use-breakpoint";

interface ProfilePageViewProps {
  userLogin: string;
  userEmail?: string;
  isNotificationEnabled: boolean;
  walletAddress: string;
  isCouncil: boolean;
  showRemoveModal: boolean;
  isSaveButtonDisabled: boolean;
  isSwitchDisabled: boolean;
  isEmailInvalid: boolean;
  handleClickDisconnect: () => void;
  hideRemoveModal: () => void;
  disconnectGithub: () => void;
  handleEmailChange: (e) => void;
  onSave: () => void;
  onSwitchChange: (value: boolean) => void;
}

export default function ProfilePageView({
  userLogin,
  walletAddress,
  userEmail,
  isNotificationEnabled,
  isCouncil,
  showRemoveModal,
  isSaveButtonDisabled,
  isSwitchDisabled,
  isEmailInvalid,
  handleClickDisconnect,
  hideRemoveModal,
  disconnectGithub,
  handleEmailChange,
  onSave,
  onSwitchChange,
}: ProfilePageViewProps) {
  const { t } = useTranslation(["common", " profile"]);

  const { isMobileView, isTabletView } = useBreakPoint();

  const isTabletOrMobile = isMobileView || isTabletView ? true : false;
  const handleClasses = "text-white xl-semibold font-weight-medium text-truncate";

  return (
    <>
      <div className="border-bottom border-gray-850 border-xl-0">
        <CustomContainer>
          <ResponsiveWrapper xl={false} xs={true} className="mb-4">
            <h4>{t(`common:main-nav.nav-avatar.profile`)}</h4>
          </ResponsiveWrapper>
        </CustomContainer>
      </div>

      <ProfileLayout>
        <div className="row mb-4">
          <div className="col">
            <div
              className={`${
                isTabletOrMobile ? "d-flex" : null
              } mt-3 align-items-center`}
            >
              <AvatarOrIdenticon
                user={userLogin}
                address={walletAddress}
                size={isTabletOrMobile ? "md" : "lg"}
                withBorder
              />
              <div className={`d-flex flex-column ${isTabletOrMobile ? "ms-2" : "mt-2" }`}>
                <If
                  condition={!!userLogin}
                  otherwise={
                    <AddressWithCopy
                      address={walletAddress}
                      textClass={handleClasses}
                      truncated
                    />
                  }
                >
                  <span className={handleClasses}>
                    {userLogin}
                  </span>
                </If>

                <If condition={!!userLogin}>
                  <AddressWithCopy
                    address={walletAddress}
                    textClass="caption-medium font-weight-normal text-capitalize text-gray-300"
                    truncated
                  />
                </If>
              </div>
            </div>
            {isCouncil && (
              <Badge
                label={t("profile:council")}
                color="purple-30"
                className="caption border border-purple text-purple border-radius-8 mt-3"
              />
            )}
          </div>
        </div>

        <Divider bg="gray-850" />

        <div className="row mb-4 mt-4">
          <div className="col-8">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="base-medium text-white">Notifications</span>

              <Switch
                value={isNotificationEnabled}
                onChange={onSwitchChange}
                disabled={isSwitchDisabled}
              />  
            </div>

            <div className="row">
              <span className="text-gray-500 xs-medium font-weight-normal">
                Allow Bepro Network to send you updates via email. These can include updates to bounties, app updates, etc.
              </span>
            </div>

            <If condition={isNotificationEnabled}>
              <div className="row mt-3">
                <div className="col-12 col-md-6">
                  <input type="email" className="form-control" value={userEmail} onChange={handleEmailChange} />
                  <If condition={isEmailInvalid}>
                    <small>Invalid email</small>
                  </If>
                </div>

                <div className="col-12 col-md-6">
                  <Button
                    onClick={onSave}
                    disabled={isSaveButtonDisabled}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </If>
          </div>
        </div>

        <Divider bg="gray-850" />

        <div className="row mt-4 mb-3">
          <span className="caption text-white text-capitalize font-weight-medium">{t("profile:connections")}</span>
        </div>

        <GithubConnectionState handleClickDisconnect={handleClickDisconnect} />

        <RemoveGithubAccount
          show={showRemoveModal}
          githubLogin={userLogin}
          walletAddress={walletAddress}
          onCloseClick={hideRemoveModal}
          disconnectGithub={disconnectGithub}
        />
      </ProfileLayout>
    </>
  );
}
