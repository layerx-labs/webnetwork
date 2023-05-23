import { useState } from "react";
import { Offcanvas } from "react-bootstrap";

import ArrowLeft from "assets/icons/arrow-left";
import ArrowRight from "assets/icons/arrow-right";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import Button from "components/button";
import If from "components/If";
import InternalLink from "components/internal-link";
import ChainSelector from "components/main-nav/chain-selector";
import CreateNetworkBountyButton from "components/main-nav/create-network-bounty-button";
import DisconnectWalletButton from "components/main-nav/disconnect-wallet-button";
import HelpButton from "components/main-nav/help-button";
import ProfileLinks from "components/profile/profile-links";

import { useAppState } from "contexts/app-state";

import { NAVIGATION_LINKS } from "helpers/navigation-links";
import { truncateAddress } from "helpers/truncate-address";

import { useAuthentication } from "x-hooks/use-authentication";

interface MenuDrawerProps {
  show: boolean;
  onHide: () => void;
}

export default function MenuDrawer({
  show,
  onHide
}: MenuDrawerProps) {
  const [isProfileLinksVisible, setIsProfileLinksVisible] = useState(false);
  
  const { state } = useAppState();
  const { disconnectWallet } = useAuthentication();

  const displayName = state.currentUser?.login || truncateAddress(state.currentUser?.walletAddress);
  const isConnected = !!state.currentUser?.walletAddress;

  function handleDisconnect() {
    setIsProfileLinksVisible(false);
    onHide();
    disconnectWallet();
  }

  function handleShowProfileLinks() {
    setIsProfileLinksVisible(true);
  }

  function handleHideProfileLinks() {
    setIsProfileLinksVisible(false);
  }

  function handleHideDrawer() {
    handleHideProfileLinks();
    onHide();
  }


  function GlobalLink({ label, href }) {
    return(
      <InternalLink
        label={label}
        href={href}
        className="caption-medium font-weight-medium text-white text-capitalize max-width-content m-0 p-0 mt-2"
        transparent
      />
    );
  }

  function MyProfileBtn({ onClick, isBack = false }) {
    return(
      <Button
        transparent
        className="font-weight-medium text-capitalize p-0 mt-1 not-svg gap-1"
        textClass="text-gray-500"
        onClick={onClick}
      >
        <If condition={isBack}>
          <div className="mr-1">
            <ArrowLeft height={16} width={16} />
          </div>
        </If>
        <span>
          My profile
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
      onHide={handleHideDrawer}
      placement="end"
    >
        <Offcanvas.Header 
          closeButton  
          closeVariant="white"
        >
          <Offcanvas.Title>
            <If condition={isProfileLinksVisible}>
              <MyProfileBtn
                onClick={handleHideProfileLinks}
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
                    <AvatarOrIdenticon
                      user={state.currentUser?.login}
                      address={state.currentUser?.walletAddress}
                    />
                  </div>

                  <div className="col">
                    <span>{displayName}</span>
                    <MyProfileBtn
                      onClick={handleShowProfileLinks}
                    />
                  </div>
                </div>
              </If>

              <div className="d-flex flex-column gap-4 py-3">
                <CreateNetworkBountyButton />

                {NAVIGATION_LINKS.global.map(GlobalLink)}
              </div>
            </If>

            <If condition={isProfileLinksVisible}>
              <ProfileLinks />
            </If>


            <div className={`col ${ isConnected ? "border-top border-gray-800" : ""}`}>
              <If condition={isConnected}>
                <DisconnectWalletButton onClick={handleDisconnect} />
              </If>
            </div>

            <div className="d-flex justify-content-end">
              <div className="flex-grow-1">
                <ChainSelector />
              </div>

              <HelpButton />
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
  );
}