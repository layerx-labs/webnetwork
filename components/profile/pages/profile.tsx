import React, {useState} from "react";

import {useTranslation} from "next-i18next";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import Badge from "components/badge";
import GithubConnectionState from "components/github-connection-state";
import KycSessionModal from "components/modals/kyc-session";
import ProfileLayout from "components/profile/profile-layout";
import {RemoveGithubAccount} from "components/profile/remove-github-modal";
import ResponsiveWrapper from "components/responsive-wrapper";

import {useAppState} from "contexts/app-state";

import {truncateAddress} from "helpers/truncate-address";

import {useAuthentication} from "x-hooks/use-authentication";
import useBreakPoint from "x-hooks/use-breakpoint";

export default function ProfilePage() {
  const { t } = useTranslation(["common"," profile"]);
  
  const { isMobileView, isTabletView } = useBreakPoint();

  const isTabletOrMobile = (isMobileView || isTabletView) ? true : false

  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const {state} = useAppState();

  const { disconnectGithub } = useAuthentication();

  const addressOrUsername =
    state.currentUser?.login ? state.currentUser.login : truncateAddress(state.currentUser?.walletAddress);

  const handleClickDisconnect = () => setShowRemoveModal(true);
  const hideRemoveModal = () => setShowRemoveModal(false);

  return(
    <ProfileLayout>
      <ResponsiveWrapper
        xl={false}
        xs={true}
        className="mb-4"
      >
        <h4>{t(`common:main-nav.nav-avatar.profile`)}</h4>
      </ResponsiveWrapper>
      <div className="row mb-5">
      <div className="col">
          <div
            className={`${
              isTabletOrMobile ? "d-flex" : null
            } mt-3 align-items-center`}
          >
            <AvatarOrIdenticon
              user={state.currentUser?.login}
              address={state.currentUser?.walletAddress}
              size={isTabletOrMobile ? "md" : "lg"}
            />
            <div className="text-truncate">
              <h4
                className={`${
                  isTabletOrMobile ? "ms-2" : "mt-2"
                } text-gray text-uppercase text-truncate mr-2`}
              >
                {addressOrUsername}
              </h4>
            </div>
          </div>
          {state.Service?.network?.active?.isCouncil && (
            <Badge
              label={t("profile:council")}
              color="purple-30"
              className="caption border border-purple text-purple border-radius-8 mt-3"
            />
          )}
        </div>
      </div>

      <div className="row mb-3">
        <span className="caption text-gray">{t("profile:connections")}</span>
      </div>

      <GithubConnectionState handleClickDisconnect={handleClickDisconnect} />
       
       {state.Settings?.kyc?.isKycEnabled && (
        <div className="mt-4">
          <KycSessionModal/>
        </div>
       )}

      <RemoveGithubAccount
        show={showRemoveModal}
        githubLogin={state.currentUser?.login}
        walletAddress={state.currentUser?.walletAddress}
        onCloseClick={hideRemoveModal}
        disconnectGithub={disconnectGithub}
      />
    </ProfileLayout>
  );
}