import { useState } from "react";
import { Offcanvas } from "react-bootstrap";

import ArrowRight from "assets/icons/arrow-right";

import AvatarOrIdenticon from "components/avatar-or-identicon";
import Button from "components/button";
import If from "components/If";
import InternalLink from "components/internal-link";
import ChainSelector from "components/main-nav/chain-selector";
import CreateNetworkBountyButton from "components/main-nav/create-network-bounty-button";
import DisconnectWalletButton from "components/main-nav/disconnect-wallet-button";
import HelpButton from "components/main-nav/help-button";

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

  function handleDisconnect() {
    setIsProfileLinksVisible(false);
    onHide();
    disconnectWallet();
  }

  function handleShowProfileLinks() {
    setIsProfileLinksVisible(true);
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

  return(
    <Offcanvas 
      className="bg-gray-950"
      show={show}
      onHide={onHide}
      placement="end"
    >
        <Offcanvas.Header 
          closeButton  
          closeVariant="white"
        >
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <div className="h-100 px-2 d-flex flex-column">
            <If condition={!isProfileLinksVisible}>
              <div className="row border-bottom border-gray-800 pb-3 mx-0">
                <div className="col-auto">
                  <AvatarOrIdenticon
                    user={state.currentUser?.login}
                    address={state.currentUser?.walletAddress}
                  />
                </div>

                <div className="col">
                  <span>{displayName}</span>
                  <Button
                    transparent
                    className="font-weight-medium text-capitalize p-0 mt-1 not-svg gap-1"
                    textClass="text-gray-500"
                    onClick={handleShowProfileLinks}
                  >
                    <span>
                      My profile
                    </span>
                    <ArrowRight height={9} />
                  </Button>
                </div>
              </div>

              <div className="d-flex flex-column gap-4 border-bottom border-gray-800 py-3">
                <CreateNetworkBountyButton />

                {NAVIGATION_LINKS.global.map(GlobalLink)}
              </div>
            </If>


            <div className="col">
              <DisconnectWalletButton onClick={handleDisconnect} />
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