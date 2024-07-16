import getConfig from "next/config";

import ChainIcon from "components/chain-icon";
import NetworkLogo from "components/network-logo";

import {baseApiImgUrl} from "../../../services/api";

const {publicRuntimeConfig} = getConfig();
interface MarketplaceWithNetworkLogoProps {
  networkLogo: string;
  marketplaceLogo: string;
}
export default function MarketplaceWithNetworkLogo ({
  networkLogo,
  marketplaceLogo
}: MarketplaceWithNetworkLogoProps) {
  return(
    <div className="position-relative">
      <NetworkLogo
        src={`${baseApiImgUrl}/${publicRuntimeConfig?.urls?.ipfs}/${marketplaceLogo}`}
        shape="square"
        size="lg"
        noBg
        className="p-0 border-0"
      />

      <div className="position-absolute p-1 rounded-circle bg-gray-900" style={{left: 18, top: 18}}>
        <ChainIcon
          src={networkLogo}
          size="21"
        />
      </div>
    </div>
  );
}