import { Row } from "react-bootstrap";

import Delegations from "components/profile/pages/voting-power/delegations/controller";
import OraclesActions from "components/profile/pages/voting-power/oracles/actions/controller";
import OraclesDelegate from "components/profile/pages/voting-power/oracles/delegate/controller";
import TotalVotes from "components/profile/pages/voting-power/total-votes/view";

import {Curator} from "interfaces/curators";
import {Network} from "interfaces/network";
import {SupportedChainData} from "interfaces/supported-chain-data";

interface VotingPowerNetworkViewProps {
  chains: SupportedChainData[];
  networks: Network[];
  locked: Curator[];
  delegatedToMe: Curator[];
  delegations: Curator[];
}

export default function VotingPowerNetworkView({
  locked,
  delegatedToMe,
  delegations,
}: VotingPowerNetworkViewProps) {

  return(
    <>
      <TotalVotes
        locked={locked}
        delegatedToMe={delegatedToMe}
      />

      {/*<Row className="mt-4 mb-4">*/}
      {/*  <OraclesActions*/}
      {/*    wallet={{*/}
      {/*      address: walletAddress,*/}
      {/*      balance: userBalance,*/}
      {/*      isCouncil: userIsCouncil,*/}
      {/*      isNetworkGovernor: userIsGovernor*/}
      {/*    }}*/}
      {/*    updateWalletBalance={handleUpdateWalletBalance}*/}
      {/*  />*/}

      {/*  <OraclesDelegate*/}
      {/*    wallet={{*/}
      {/*      address: walletAddress,*/}
      {/*      balance: userBalance,*/}
      {/*      isCouncil: userIsCouncil,*/}
      {/*      isNetworkGovernor: userIsGovernor*/}
      {/*    }}*/}
      {/*    updateWalletBalance={handleUpdateWalletBalance}*/}
      {/*    defaultAddress={delegationAddress}*/}
      {/*  />*/}
      {/*</Row>*/}

      <Delegations
        delegations={delegations}
      />
    </>
  );
}