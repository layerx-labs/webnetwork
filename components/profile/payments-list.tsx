import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import PaymentItem from "components/profile/payment-item";
import ResponsiveWrapper from "components/responsive-wrapper";

import { Network } from "interfaces/network";
import { Payment } from "interfaces/payments";

import { useNetwork } from "x-hooks/use-network";

import NetworkItem from "./network-item/controller";
import { TotalFiatNetworks } from "./pages/payments";
import { FlexColumn } from "./wallet-balance";

interface PaymentsListProps {
  payments: Payment[];
  networks: Network[];
  totalNetworks: TotalFiatNetworks[];
  symbol: string;
}

// TODO: Add InfiniteScroll and pagination
export default function PaymentsList({
  payments,
  networks,
  totalNetworks,
  symbol
}: PaymentsListProps) {
  const { push } = useRouter();
  const { t } = useTranslation(["common", "profile", "bounty"]);

  const { getURLWithNetwork } = useNetwork();

  const headers = [
    t("custom-network:steps.network-information.fields.name.default"),
    "Total payments",
    "Network link",
  ];

  function handleItemClick(issueId: string, chainName: string, networkName: string) {
    const [repoId, id] = issueId.split("/");

    push(getURLWithNetwork("/bounty", { id, repoId, chain: chainName, network: networkName}));
  }

  function handleAmount(networkId: number) {
    return totalNetworks
      .filter((n) => n?.networkId === networkId)
      .reduce((acc, token) => acc + token.value * (token.price || 0), 0);
  }

  if (!payments || !networks) return null;
  return (
    <>
      <ResponsiveWrapper 
        xs={false}
        xl={true}
        className="row"
      >
        {headers.map(title => 
          <div className="col-3">
            <div className="row text-center">
              <span className="caption-medium text-gray-500 font-weight-normal text-capitalize">{title}</span>
            </div>
          </div>)}
      </ResponsiveWrapper>

      {networks &&
        networks?.map((network, key) => (
          <NetworkItem
            key={key}
            type="payments"
            variant="multi-network"
            networkName={network?.name}
            iconNetwork={network?.logoIcon}
            networkChain={network?.chain?.chainShortName}
            handleNetworkLink={() => {
              push(getURLWithNetwork("/", { chain: network?.chain?.chainShortName, network: network?.name }))
            }}
            amount={handleAmount(network?.id)}
            symbol={symbol}
          >
            <FlexColumn className="col-12">
              {payments &&
                payments
                  ?.filter((p) => network?.id === p?.issue?.network?.id)
                  .map((payment: Payment) =>
                    PaymentItem({
                      ...payment,
                      labelToken: t("misc.$token"),
                      labelBounty: t("bounty:label"),
                      handleItemClick,
                    }))}
            </FlexColumn>
          </NetworkItem>
        ))}
    </>
  );
}