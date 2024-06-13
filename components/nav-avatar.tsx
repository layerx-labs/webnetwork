import {useState} from "react";
import {OverlayTrigger, Popover} from "react-bootstrap";

import {useTranslation} from "next-i18next";
import NextLink from "next/link";
import {useRouter} from "next/router";

import ExternalLinkIcon from "assets/icons/external-link-icon";

import {AvatarCurrentUser} from "components/avatar-current-user/avatar-current-user.controller";
import Button from "components/button";
import DisconnectWalletButton from "components/common/buttons/disconnect-wallet/view";
import {PointsBadge} from "components/common/points/points-badge.view";

import {DISCORD_LINK, DOCS_LINK, SUPPORT_LINK, TWITTER_LINK} from "helpers/constants";
import {formatNumberToNScale} from "helpers/formatNumber";
import {getProfileLinks} from "helpers/navigation-links";
import {truncateAddress} from "helpers/truncate-address";

import {ProfilePages} from "interfaces/utils";

import {useUserStore} from "x-hooks/stores/user/user.store";
import {useAuthentication} from "x-hooks/use-authentication";
import useMarketplace from "x-hooks/use-marketplace";
import {userPointsOfUser} from "x-hooks/use-points-of-user";

export default function NavAvatar() {
  const { asPath } = useRouter();
  const { t } = useTranslation("common");

  const [visible, setVisible] = useState(false);

  const { currentUser } = useUserStore();
  const { signOut } = useAuthentication();
  const { totalPoints } = userPointsOfUser();
  const { goToProfilePage } = useMarketplace();

  const username =
    currentUser?.login ? currentUser.login : truncateAddress(currentUser?.walletAddress);

  function handleInternalLinkClick(profilePage: ProfilePages) {
    setVisible(false);

    goToProfilePage(profilePage);
  }

  function handleDisconnectWallet() {
    const redirect = asPath?.includes("connect-account") ? "connect-account" : null;

    signOut(redirect);
    setVisible(false);
  }

  const ProfileInternalLink = ({
    label,
    href,
    className = "",
  }: {
    label: string;
    href?: ProfilePages;
    className?: string;
  }) => {
    if(!href) return null;
    
    return (
      <Button
      className={`mb-1 p family-Regular p-0 text-capitalize font-weight-normal mx-0 ${className}`}
      align="left"
      key={label}
      data-testid={label}
      onClick={() => handleInternalLinkClick(href)}
      transparent
    >
      {label}
    </Button>
    )
  }

  const ProfileExternalLink = ({ label, href, className = "" }) => (
    <div className={`d-flex flex-row align-items-center justify-content-between ${className}`} key={label}>
      <a
        href={href}
        className={`text-decoration-none p family-Regular ${ className || "text-gray"}`}
        data-testid={label}
        target="_blank"
      >
          {label}
        </a>
      <ExternalLinkIcon width={12} height={12} />
    </div>
  );

  const LinksSession = ({ children }) => (
    <div className="row align-items-center border-bottom border-light-gray py-2">
      <div className="d-flex flex-column gap-3 py-1 px-0">
        {children}
      </div>
    </div>
  );

  const Link = (label, href) => ({ label, href });

  const externalLinks = [
    Link(t("main-nav.nav-avatar.support-center"), SUPPORT_LINK),
    Link(t("main-nav.nav-avatar.guides"), DOCS_LINK),
    Link(t("main-nav.nav-avatar.join-discord"), DISCORD_LINK),
    Link(t("main-nav.nav-avatar.follow-on-twitter"), TWITTER_LINK),
  ];

  const overlay = (
    <Popover id="profile-popover">
      <Popover.Body className="bg-shadow pt-3 px-4">
        <div className="row align-items-center border-bottom border-light-gray pb-2">
          <div className="col-3 px-0">
            <AvatarCurrentUser size="md" />
          </div>

          <div className="col-9 p-0">
              <div className="d-flex flex-row justify-content-left mb-1">
              <span className="caption-large text-white mb-1 text-capitalize font-weight-normal text-truncate">
                {username}
              </span>
              </div>

              <div className="d-flex flex-row justify-content-left">
                <ProfileInternalLink
                  href="dashboard"
                  label={t("main-nav.nav-avatar.my-profile")}
                  className="text-gray p family-Regular"
                />
              </div>
          </div>
        </div>

        <NextLink href="/points">
          <div 
            className="row align-items-center border-bottom border-light-gray py-2 cursor-pointer"
            onClick={() => setVisible(false)}
          >
            <div className="col px-0">
              <span className="text-white text-gray-hover sm-regular">
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

        <LinksSession>

          <NextLink href={`/profile/${currentUser?.login || currentUser.walletAddress}`} className="mb-1 mx-0">
            <a href={`/profile/${currentUser?.login || currentUser.walletAddress}`}
               onClick={() => setVisible(false)}
               className="p family-Regular p-0 text-capitalize font-weight-normal text-decoration-none p family-Regular btn-primary bg-transparent text-white">{t('main-nav.nav-avatar.public-profile')}</a>
          </NextLink>

          {getProfileLinks(t).map(ProfileInternalLink)}
        </LinksSession>

        <LinksSession>
          {externalLinks.map(ProfileExternalLink)}
        </LinksSession>

        <LinksSession>
          <ProfileExternalLink
            label={t("main-nav.nav-avatar.web-network-1")}
            href="https://v1.bepro.network/"
            className="text-primary"
          />
        </LinksSession>

        <div className="row align-items-center">
          <DisconnectWalletButton onClick={handleDisconnectWallet} />
        </div>
      </Popover.Body>
    </Popover>
  );

  return(
    <div className="cursor-pointer popover-without-arrow profile-menu">
      <OverlayTrigger
        show={visible}
        rootClose={true}
        trigger="click"
        placement={"bottom-end"}
        onToggle={(next) => setVisible(next)}
        overlay={overlay}
      >
        <div className="d-flex flex-column align-items-center justify-content-center">
          <AvatarCurrentUser size="md" />
        </div>
      </OverlayTrigger>
    </div>
  );
}