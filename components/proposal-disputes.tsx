import BigNumber from "bignumber.js";
import { useTranslation } from "next-i18next";

import { useAppState } from "contexts/app-state";

import { truncateAddress } from "helpers/truncate-address";

import BountyDistributionItem from "./bounty-distribution-item";

export function ProposalDisputes({ proposalId }: { proposalId: number }) {
  const { state } = useAppState();
  const { t } = useTranslation(["proposal", "common"]);

  const disputes = state.currentBounty?.data?.disputes || [];
  const networkTokenSymbol = state.Service?.network?.active?.networkToken?.symbol || t("common:misc.token");

  const isLastItem = (target, currentIndex) => target?.length - 1 === currentIndex;

  function percentage(value: string, decimals = 2) {
    return BigNumber(value)
      .dividedBy(state.currentUser?.balance?.staked?.toNumber())
      .multipliedBy(100)
      .toFixed(decimals);
  }

  if (
    !state?.currentBounty ||
    !state.currentBounty?.data?.disputes?.length ||
    !proposalId ||
    !disputes.find((dispute) => dispute.proposalId === proposalId)
  )
    return null;

  return (
    <div>
      <div className="p-3 bg-gray-900 d-flex align-item-center rounded-top-5">
        <h4 className="text-uppercase caption-medium text-gray">
          {t("proposal:disputes.title")}
        </h4>
      </div>

      <ul className="d-flex flex-column gap-px-1">
        {disputes
          ?.filter((v) => v.proposalId === proposalId)
          .map((dispute, index, origin) => (
            <BountyDistributionItem
              name={truncateAddress(dispute?.address)}
              percentage={percentage(dispute?.weight?.toString())}
              symbols={[
                networkTokenSymbol,
                state.Settings?.currency?.defaultFiat,
              ]}
              amounts={[dispute?.weight?.toString()]}
              line={true}
              key={`dispute-${dispute?.address}-${dispute?.weight}`}
              className={isLastItem(origin, index) ? "rounded-bottom-5" : ""}
              isNetworkToken
            />
          ))}
      </ul>
    </div>
  );
}
