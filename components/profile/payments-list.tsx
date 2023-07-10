import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import PaymentItem from "components/profile/payment-item";
import ResponsiveWrapper from "components/responsive-wrapper";

import { Payment } from "interfaces/payments";

import { NetworkPaymentsData } from "types/api";

import { useNetwork } from "x-hooks/use-network";

import NetworkItem from "./network-item/controller";
import { TotalFiatNetworks } from "./pages/payments";
import { FlexColumn } from "./wallet-balance";

interface PaymentsListProps {
  payments: NetworkPaymentsData[];
  totalNetworks: TotalFiatNetworks[];
  symbol: string;
}

// TODO: Add InfiniteScroll and pagination
export default function PaymentsList({
  payments,
  totalNetworks,
  symbol
}: PaymentsListProps) {
  const { push } = useRouter();
  const { t } = useTranslation(["common", "profile", "bounty"]);

  const { getURLWithNetwork } = useNetwork();

  const headers = [
    {
      label: t("profile:network-columns.network-name"),
      align: "left px-2",
    },
    {
      label: t("profile:network-columns.total-received"),
      align: "center",
    },
    {
      label: t("profile:network-columns.network-link"),
      align: "center",
    },
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

  return (
    <>
      <ResponsiveWrapper 
        xs={false}
        xl={true}
        className="row"
      >
        {headers.map(({ label, align }) => 
          <div className="col-3">
            <div className={`row text-${align}`}>
              <span className="caption-medium text-gray-500 font-weight-normal text-capitalize">{label}</span>
            </div>
          </div>)}
      </ResponsiveWrapper>

      {payments?.map(network => (
        <NetworkItem
          key={`payments-${network?.networkAddress}`}
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
          <FlexColumn className="col-12 gap-2">
            {network?.payments
              .map((payment: Payment) =>
                PaymentItem({
                  ...payment,
                  network: network,
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