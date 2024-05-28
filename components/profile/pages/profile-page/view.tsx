import React from "react";

import {useTranslation} from "next-i18next";

import Badge from "components/badge";
import CustomContainer from "components/custom-container";
import {Divider} from "components/divider";
import InternalLink from "components/internal-link";
import AddressWithCopy from "components/profile/address-with-copy/controller";
import {AvatarForm} from "components/profile/avatar-form/avatar-form.controller";
import DashboardLayout from "components/profile/dashboard-layout";
import LanguageForm from "components/profile/language-form/language-form.controller";
import NotificationForm from "components/profile/notification-form/controller";
import UserNameForm from "components/profile/user-name-form/controller";
import ResponsiveWrapper from "components/responsive-wrapper";

import useBreakPoint from "x-hooks/use-breakpoint";

import {AboutSocial} from "../../about-social/about-social-controller";

interface ProfilePageViewProps { 
  walletAddress: string;
  handle?: string;
  isCouncil: boolean;
}

export default function ProfilePageView({
  walletAddress,
  handle,
  isCouncil,
}: ProfilePageViewProps) {
  const { t } = useTranslation(["common", " profile"]);

  const { isMobileView, isTabletView } = useBreakPoint();

  const isTabletOrMobile = isMobileView || isTabletView;

  return (
    <>
      <div className="border-bottom border-gray-850 border-xl-0">
        <CustomContainer>
          <ResponsiveWrapper xl={false} xs={true} className="mb-4">
            <h4>{t(`common:main-nav.nav-avatar.profile`)}</h4>
          </ResponsiveWrapper>
        </CustomContainer>
      </div>

      <DashboardLayout>
        <div className="row mb-4">
          <div className="col">
            <div className="row mt-3">
              <AvatarForm />
            </div>

            <UserNameForm />
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

            <div className="row">
              <div className="col col-lg-auto">
                <div className="row mx-0">
                  <InternalLink
                    label={"Go to public profile"}
                    href={`/profile/${handle || walletAddress}`}
                    className="mt-3"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <AboutSocial />
        <NotificationForm />
        <LanguageForm />
        <Divider bg="gray-850" />
      </DashboardLayout>
    </>
  );
}
