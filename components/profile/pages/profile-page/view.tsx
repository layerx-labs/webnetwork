import React from "react";

import {useTranslation} from "next-i18next";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import Badge from "components/badge";
import CustomContainer from "components/custom-container";
import { Divider } from "components/divider";
import AddressWithCopy from "components/profile/address-with-copy/controller";
import NotificationForm from "components/profile/notification-form/view";
import ProfileLayout from "components/profile/profile-layout";
import UserNameForm from "components/profile/user-name-form/view";
import ResponsiveWrapper from "components/responsive-wrapper";

import useBreakPoint from "x-hooks/use-breakpoint";

interface ProfilePageViewProps { 
  userEmail?: string;
  userName?: string;
  isEditUserName?: boolean;
  isNotificationEnabled: boolean;
  walletAddress: string;
  isCouncil: boolean;
  isSaveButtonDisabled: boolean;
  isSwitchDisabled: boolean;
  isEmailInvalid: boolean;
  isConfirmationPending: boolean;
  isExecutingHandle: boolean;
  isExecutingEmail: boolean;
  emailVerificationError?: string;
  isUserNameInvalid: boolean;
  onHandleEmailChange: (e) => void;
  onHandleUserNameChange: (e) => void;
  onHandleEditUserName: (e: boolean) => void;
  onSaveEmail: () => void;
  onSaveHandle: () => void;
  onResend: () => void;
  onSwitchChange: (value: boolean) => void;
}

export default function ProfilePageView({
  walletAddress,
  userEmail,
  userName,
  isEditUserName,
  isNotificationEnabled,
  isCouncil,
  isSaveButtonDisabled,
  isSwitchDisabled,
  isEmailInvalid,
  isConfirmationPending,
  isExecutingHandle,
  isExecutingEmail,
  emailVerificationError,
  isUserNameInvalid,
  onHandleEmailChange,
  onHandleUserNameChange,
  onHandleEditUserName,
  onSaveEmail,
  onSaveHandle,
  onResend,
  onSwitchChange
}: ProfilePageViewProps) {
  const { t } = useTranslation(["common", " profile"]);

  const { isMobileView, isTabletView } = useBreakPoint();

  const isTabletOrMobile = isMobileView || isTabletView ? true : false;

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
                address={walletAddress}
                size={isTabletOrMobile ? "md" : "lg"}
                withBorder
              />
            </div>
              <UserNameForm 
                userName={userName} 
                isEditUserName={isEditUserName} 
                isSaveButtonDisabled={!userName || isUserNameInvalid || isExecutingHandle} 
                isUserNameInvalid={isUserNameInvalid} 
                isExecuting={isExecutingHandle} 
                isApprovedName={true}
                onHandleUserNameChange={onHandleUserNameChange} 
                onHandleEditUserName={onHandleEditUserName} 
                onSave={onSaveHandle} 
              />
              <div className={`${isTabletOrMobile ? "ms-2" : "mt-2" } text-truncate`}>
                    <AddressWithCopy
                      address={walletAddress}
                      textClass="caption-medium font-weight-normal text-capitalize text-gray-300"
                      truncated
                    />
              {isCouncil && (
                <Badge
                  label={t("profile:council")}
                  color="purple-30"
                  className="caption border border-purple text-purple border-radius-8 mt-3"
                />
              )}
              </div>
            </div>
        </div>

        <NotificationForm 
          userEmail={userEmail} 
          isNotificationEnabled={isNotificationEnabled} 
          isSaveButtonDisabled={isSaveButtonDisabled} 
          isSwitchDisabled={isSwitchDisabled} 
          isEmailInvalid={isEmailInvalid} 
          isConfirmationPending={isConfirmationPending} 
          isExecuting={isExecutingEmail} 
          onHandleEmailChange={onHandleEmailChange} 
          onSave={onSaveEmail} 
          onResend={onResend} 
          onSwitchChange={onSwitchChange}   
          emailVerificationError={emailVerificationError}     
        />

        <Divider bg="gray-850" />

      </ProfileLayout>
    </>
  );
}
