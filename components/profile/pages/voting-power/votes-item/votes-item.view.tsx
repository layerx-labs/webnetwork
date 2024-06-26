import {useTranslation} from "next-i18next";

import ContractButton from "components/common/buttons/contract-button/contract-button.controller";
import MarketplaceWithNetworkLogo
  from "components/common/marketplace-with-network-logo/marketplace-with-network-logo.view";
import If from "components/If";

import {formatStringToCurrency} from "helpers/formatNumber";
interface VotesItemProps {
  networkLogo: string;
  networkName: string;
  chainLogo: string;
  chainName: string;
  amount: string;
  tokenSymbol: string;
  disabled?: boolean;
  type?: "locked" | "delegated"
  transactionHash?: string;
  dataTestid?: string;
  onTakeBackClick?: () => void;
}

export default function VotesItem({
  networkLogo,
  networkName,
  chainLogo,
  chainName,
  amount,
  tokenSymbol,
  disabled,
  type = "locked",
  transactionHash,
  dataTestid,
  onTakeBackClick
}: VotesItemProps) {
  const { t } = useTranslation("common");

  const isLockedType = type === "locked";
  const mainLabel = isLockedType ? networkName : `${formatStringToCurrency(amount)} $${tokenSymbol}`;
  const secondaryLabel = isLockedType ? chainName : transactionHash;

  return (
    <div
      className={`row align-items-center gap-2 border-radius-4 border border-gray-800 bg-gray-900 px-3 pt-3 pb-4 mb-3`}
      data-testid={dataTestid}
    >
      <div className="col-auto px-0">
        <MarketplaceWithNetworkLogo
          networkLogo={chainLogo}
          marketplaceLogo={networkLogo}
        />
      </div>

      <div className="col">
        <div className="row">
          <span className="xs-medium text-white text-uppercase pt-2">
            {mainLabel}
          </span>
        </div>

        <div className="row pt-2">
            <span className="xs-medium text-gray-500 text-capitalize font-weight-normal">
              {secondaryLabel}
            </span>
        </div>
      </div>


        <div className="col-auto">
          <If
            condition={isLockedType}
            otherwise={
              <ContractButton
                color="gray-850"
                textClass="text-gray-200 font-weight-500 text-capitalize"
                className="border-radius-4 border border-gray-700"
                onClick={onTakeBackClick}
                disabled={disabled}
                data-testid="take-back-btn"
              >
                {t("actions.take-back")}
              </ContractButton>
            }
          >
            <div className="row gap-2">
              <div className="col px-0">
              <span className="xs-medium text-white">
                {formatStringToCurrency(amount)}
              </span>
              </div>
              <div className="col px-0">
              <span className="xs-medium text-white text-uppercase">
                ${tokenSymbol}
              </span>
              </div>
            </div>
          </If>
        </div>
    </div>
  );
}