import { useTranslation } from "next-i18next";

import { FlexRow } from "components/common/flex-box/view";
import If from "components/If";
import VotingPowerSubTitle from "components/profile/pages/voting-power/sub-title/controller";
import VotesItem from "components/profile/pages/voting-power/votes-item/votes-item.view";

import {Curator, Delegation} from "interfaces/curators";

interface DelegationsViewProps {
  delegations?: Curator[];
  disabled?: boolean;
  onTakeBackClick: (delegation: Delegation) => void;
}

export default function DelegationsView({
  delegations,
  disabled,
  onTakeBackClick,
}: DelegationsViewProps) {
  const { t } = useTranslation(["common", "profile", "my-oracles"]);

  return (
    <div className="col border border-gray-800 p-4 border-radius-4 col-12 mb-4">
      <FlexRow className="mb-3 justify-content-between align-items-center">
        <VotingPowerSubTitle 
          label={t("profile:deletaged-to-others")}
        />
      </FlexRow>

      <div className="row mx-0">
        <If
          otherwise={
            <div className="bg-gray-900 border-radius-4 px-3 py-4 text-center">
             <span className="base-medium text-white font-weight-normal">
               {t("my-oracles:errors.no-delegates")}
             </span>
            </div>
          }
          condition={!!delegations?.length}
        >
          <div className="col">
          {
            delegations?.map(curator => curator?.delegations?.map(delegation =>
              <VotesItem
                key={
                `delegation-${delegation?.networkId}-${delegation?.from}-${delegation?.to}-${delegation?.contractId}`
                }
                disabled={disabled}
                networkLogo={curator?.network?.logoIcon}
                networkName={curator?.network?.name}
                chainLogo={curator?.network?.chain?.icon}
                chainName={curator?.network?.chain?.chainShortName}
                amount={delegation?.amount || "0"}
                tokenSymbol={curator?.network?.networkToken?.symbol}
                onTakeBackClick={() => onTakeBackClick(delegation)}
                transactionHash={delegation?.to}
                type="delegated"
              />))
          }
          </div>
        </If>
      </div>
    </div>
  );
}
