import {Offcanvas} from "react-bootstrap";

import {useTranslation} from "next-i18next";
import NextLink from "next/link";

import ArrowLeft from "assets/icons/arrow-left";
import ArrowRight from "assets/icons/arrow-right";

import { AvatarCurrentUser } from "components/avatar-current-user/avatar-current-user.controller";
import Button from "components/button";
import DisconnectWalletButton from "components/common/buttons/disconnect-wallet/view";
import HelpButton from "components/common/buttons/help/view";
import { PointsBadge } from "components/common/points/points-badge.view";
import CreateNetworkBountyButton from "components/create-network-bounty-button/controller";
import If from "components/If";
import InternalLink from "components/internal-link";
import Notifications from "components/notifications/controller";
import DashboardLinks from "components/profile/dashboard-links";
import TransactionsStateIndicator from "components/transactions-state-indicator";

import { formatNumberToNScale } from "helpers/formatNumber";
import {truncateAddress} from "helpers/truncate-address";

import {Link} from "types/utils";


interface HamburgerMenuViewProps {
  show: boolean;
  userLogin: string;
  userAddress: string;
  isConnected: boolean;
  isProfileLinksVisible: boolean;
  links: Link[];
  totalPoints: number;
  onDisconnect: () => void;
  onShowProfileLinks: () => void;
  onHideProfileLinks: () => void;
  onHideHamburger: () => void;
}

export default function HamburgerMenuView({
  show,
  userLogin,
  userAddress,
  isConnected,
  isProfileLinksVisible,
  links,
  totalPoints,
  onDisconnect,
  onShowProfileLinks,
  onHideProfileLinks,
  onHideHamburger,
}: HamburgerMenuViewProps) {
  const { t } = useTranslation("common");

  const displayName = userLogin || truncateAddress(userAddress);

  function GlobalLink({ label, href }) {
    return(
      <InternalLink
        label={t(`main-nav.${label}`) as string}
        href={href}
        data-testid={label}
        className="caption-medium font-weight-medium text-white text-capitalize max-width-content m-0 p-0 mt-2"
        transparent
        key={label}
        onClick={onHideHamburger}
      />
    );
  }

  function MyProfileBtn({ onClick, isBack = false }) {
    return(
      <Button
        transparent
        className="font-weight-medium text-capitalize p-0 mt-1 not-svg gap-1"
        textClass="text-gray-500"
        data-testid="my-profile-btn"
        onClick={onClick}
      >
        <If condition={isBack}>
          <div className="mr-1">
            <ArrowLeft height={16} width={16} />
          </div>
        </If>
        <span>
          {t("main-nav.nav-avatar.my-profile")}
        </span>
        <If condition={!isBack}>
          <ArrowRight height={9} />
        </If>
      </Button>
    );
  }

  return(
    <Offcanvas 
      className="bg-gray-950"
      show={show}
      onHide={onHideHamburger}
      placement="end"
    >
        <Offcanvas.Header 
          closeButton  
          closeVariant="white"
        >
          <Offcanvas.Title>
            <If condition={isProfileLinksVisible}>
              <MyProfileBtn
                onClick={onHideProfileLinks}
                isBack
              />
            </If>
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <div className="h-100 px-2 d-flex flex-column">
            <If condition={!isProfileLinksVisible}>
              <If condition={isConnected}>
                <div className="row border-bottom border-gray-800 pb-3 mx-0">
                  <div className="col-auto">
                    <AvatarCurrentUser />
                  </div>

                  <div className="col">
                    <span>{displayName}</span>
                    <MyProfileBtn
                      onClick={onShowProfileLinks}
                    />
                  </div>
                </div>
              </If>

              <div className="d-flex flex-column gap-4 py-3">
                <CreateNetworkBountyButton
                  actionCallBack={onHideHamburger}
                />

                <If condition={isConnected}>
                  <NextLink href="/points">
                    <div 
                      className={`row align-items-center border-top border-bottom border-gray-800 mx-0 
                        py-3 cursor-pointer`}
                      onClick={onHideHamburger}
                    >
                      <div className="col px-0">
                        <span className="text-white text-gray-hover caption-medium font-weight-medium text-capitalize">
                          {t("main-nav.nav-avatar.your-points")}
                        </span>
                      </div>

                      <div className="col-auto px-0">
                        <PointsBadge
                          points={formatNumberToNScale(totalPoints, 0)}
                          size="sm"
                          variant="filled"
                        />
                      </div>
                    </div>
                  </NextLink>
                </If>

                {links.map(GlobalLink)}
              </div>
            </If>

            <If condition={isProfileLinksVisible}>
              <DashboardLinks onClick={onHideHamburger} />
            </If>


            <div className={`col ${ isConnected ? "border-top border-gray-800" : ""}`}>
              <If condition={isConnected}>
                <DisconnectWalletButton onClick={onDisconnect} />
              </If>
            </div>

            <div className="d-flex justify-content-end">
              <HelpButton />
              <div className="mx-2"><TransactionsStateIndicator /></div>
              <Notifications/>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
  );
}