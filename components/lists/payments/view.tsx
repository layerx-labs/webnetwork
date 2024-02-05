import {useTranslation} from "next-i18next";

import PaymentItem from "components/lists/payments/item/view";
import NetworkItem from "components/profile/network-item/controller";
import {ResponsiveEle} from "components/responsive-wrapper";

import {Payment} from "interfaces/payments";

import {NetworkPaymentsData} from "types/api";

import {FlexColumn} from "../../../components/common/flex-box/view";

interface HeaderItem {
  label: string;
  align: string;
}

interface PaymentsListViewProps {
  payments: NetworkPaymentsData[];
  symbol: string;
  headers: HeaderItem[];
  convertNetworkValue: (netwok: NetworkPaymentsData) => number;
  onNetworkRedirect: (netwok: NetworkPaymentsData) => () => void;
  onPaymentRedirect: (netwok: NetworkPaymentsData, payment: Payment) => () => void;
}
export default function PaymentsListView({
  payments,
  symbol,
  headers,
  convertNetworkValue,
  onNetworkRedirect,
  onPaymentRedirect,
}: PaymentsListViewProps) {
  const { t } = useTranslation("common");

  const mapLabels = ({ label, align }: HeaderItem) => (
    <div className="col-3">
      <div className={`row text-${align}`}>
        <span className="caption-medium text-gray-500 font-weight-normal text-capitalize">{label}</span>
      </div>
    </div>
  )

  return (
    <>
      <ResponsiveEle className="row" desktopView={headers.map(mapLabels)} />

      {payments?.map(network => (
        <NetworkItem
          key={`payments-${network?.networkAddress}`}
          type="payments"
          variant="multi-network"
          networkName={network?.name}
          iconNetwork={network?.logoIcon}
          networkChain={network?.chain?.chainShortName}
          handleNetworkLink={onNetworkRedirect(network)}
          amount={convertNetworkValue(network)}
          symbol={symbol}>
          <FlexColumn className="col-12 gap-2">
            {network?.payments
              .map((payment: Payment) =>
                <PaymentItem
                  key={payment?.transactionHash}
                  {...payment}
                  network={network}
                  labelToken={t("misc.$token")}
                  labelBounty={t("bounty:label")}
                  handleItemClick={onPaymentRedirect(network, payment)}
                />)}
          </FlexColumn>
        </NetworkItem>
      ))}
    </>
  );
}