import { useRouter } from "next/router";

import ArrowUpRight from "assets/icons/arrow-up-right";
import ChevronLeftIcon from "assets/icons/chevronleft-icon";

import Button from "components/button";
import CopyButton from "components/common/buttons/copy/controller";
import CustomContainer from "components/custom-container";

import { useAppState } from "contexts/app-state";

import { formatNumberToCurrency } from "helpers/formatNumber";
import { truncateAddress } from "helpers/truncate-address";

import { NetworkPaymentsData } from "types/api";

import { useNetwork } from "x-hooks/use-network";

interface PaymentsNetworkProps {
  payments: NetworkPaymentsData;
  totalConverted: number;
  defaultFiat: string;
}

export default function PaymentsNetwork({
  payments,
  totalConverted,
  defaultFiat,
}: PaymentsNetworkProps) {
  const { push } = useRouter();

  const { state } = useAppState();
  const { goToProfilePage, getURLWithNetwork } = useNetwork();

  function handleBack() {
    goToProfilePage("payments", {
      networkName: "",
      networkChain: "",
      wallet: state.currentUser?.walletAddress
    });
  }

  function goToNetwork() {
    push(getURLWithNetwork("/", {
      network: network?.name,
      chain: network?.chain?.chainShortName
    }));
  }

  return(
    <CustomContainer>
      <div className="row align-items-center border-bottom border-gray-850 pb-3">
        <div className="col-auto">
          <Button className="p-0 text-gray-200" onClick={handleBack} transparent>
            <ChevronLeftIcon />
          </Button>
        </div>
        <div className="col">
          <h4 className="text-white font-weight-medium text-capitalize">{network?.name}</h4>
        </div>
      </div>

      <div className="row mt-4 mx-0">
        <Button
          color="gray-850"
          className="gap-1 border-radius-4 border-gray-700 text-gray-200 text-capitalize font-weight-medium not-svg"
          onClick={goToNetwork}
        >
          <span>Go to Network</span>
          <ArrowUpRight />
        </Button>
      </div>

      <div className="row align-items-center mx-0 mt-4">
        <div className="col">
        <span className="caption-medium font-weight-medium text-capitalize text-white mr-2">
          Total Received
        </span>
        </div>

        <div className={`col-auto caption-large font-weight-medium bg-gray-900 py-2 px-3 border 
          border-gray-850 border-radius-4`}>
          <span className="text-white">
            {formatNumberToCurrency(totalConverted)}
          </span>

          <span className="text-gray-600 ml-1">{defaultFiat}</span>
        </div>
      </div>

      <div className="row mx-0 mt-4 gap-3">
      {payments?.map(payment => <div className="row p-2 mx-0 bg-gray-900 border-radius-4 border border-gray-800">
        <div className="col">
          <div className="row align-items-center">
            <div className="col">
              {formatNumberToCurrency(payment?.ammount)}
              <span className="ml-1" style={{color: payment?.issue?.network?.colors?.primary}}>
                {payment?.issue?.transactionalToken?.symbol}
              </span>
            </div>

            <div className="col-auto">
              <Button
                color="gray-800"
                className="text-white"
                outline
              >
                Bounty #{payment?.issue?.issueId}
              </Button>
            </div>
          </div>

          <div className="row align-items-center mt-3">
            <div className="col-auto">
              <span className="font-weight-medium text-gray-500">
                {truncateAddress(payment?.transactionHash)}
              </span>
            </div>
            
            <div className="col-auto px-0">
              <CopyButton
                value={payment?.transactionHash}
              />
            </div>
          </div>
        </div>
      </div>)}
      </div>
    </CustomContainer>
  );
}