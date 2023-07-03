import {useTranslation} from "next-i18next";

import { FlexColumn, FlexRow } from "components/common/flex-box/view";
import InfoTooltip from "components/info-tooltip";
import { TokenBalanceType } from "components/profile/token-balance";
import ResponsiveWrapper from "components/responsive-wrapper";
import SelectChainDropdown from "components/select-chain-dropdown";
import TokenIcon from "components/token-icon";

import {formatStringToCurrency} from "helpers/formatNumber";

import { TokensOracles } from "interfaces/oracles-state";
import { SupportedChainData } from "interfaces/supported-chain-data";

import NetworkItem from "../../../network-item/controller";

interface WalletBalanceViewProps {
  totalAmount: string;
  isOnNetwork: boolean;
  hasNoConvertedToken: boolean;
  defaultFiat: string;
  tokens: TokenBalanceType[];
  tokensOracles: TokensOracles[];
  handleNetworkSelected: (chain: SupportedChainData) => void;
  handleNetworkLink?: (token: TokensOracles) => void;
}

export default function WalletBalanceView({
  totalAmount,
  isOnNetwork,
  hasNoConvertedToken,
  defaultFiat,
  tokens,
  tokensOracles,
  handleNetworkSelected,
  handleNetworkLink
}: WalletBalanceViewProps) {
  const { t } = useTranslation(["common", "profile"]);

  return(
    <FlexColumn>
      <FlexRow className="justify-content-start align-items-center mb-4">
        <span className="h3 family-Regular text-white font-weight-medium">{t("profile:wallet")}</span>
      </FlexRow>
      {!isOnNetwork && (
        <FlexRow className="justify-content-end align-items-center mb-4">
          <SelectChainDropdown
            onSelect={handleNetworkSelected}
            isOnNetwork={false}
            className="select-network-dropdown"
          />
        </FlexRow>
      )}
      <FlexRow>
        <span className="h4 family-Regular text-white font-weight-medium mb-2">{t("profile:tokens")}</span>
      </FlexRow>
      <FlexRow className="d-flex flex-wrap justify-content-between align-items-center mb-2">
          <span className="text-white">{t("labels.recivedintotal")}</span>
          <span className="d-flex mt-2 caption-medium text-white bg-dark-gray py-2 px-3 rounded-3 font-weight-medium">
            {formatStringToCurrency(totalAmount)}
            <span className="text-white-30 ml-1 mr-2">
              {!hasNoConvertedToken ? defaultFiat : t("misc.token_other")}
            </span>
            <ResponsiveWrapper className="d-flex align-items-center" xs={false} sm={false} md={true} xl={true}>
              <InfoTooltip 
                description={t("profile:tips.total-balance")}
                secondaryIcon
              />
            </ResponsiveWrapper>

          </span>
      </FlexRow>
      {tokens.map((token) => (
        <NetworkItem
          key={`balance-${token?.address}`}
          type="voting"
          iconNetwork={token?.icon}
          networkName={token?.name}
          amount={token?.balance?.toString()}
          symbol={token?.symbol}
        />
      ))}

      <FlexRow className="mt-3 mb-3 justify-content-between align-items-center">
        <span className="h4 family-Regular text-white font-weight-medium">
          {t("main-nav.nav-avatar.voting-power")}
        </span>
      </FlexRow>
      {tokensOracles &&
        tokensOracles?.map((token, key) => (
          <NetworkItem 
            key={`voting-${token?.address}-${key}`}
            type="voting"
            iconNetwork={token?.icon ? token?.icon : <TokenIcon />}
            networkName={token?.name}
            subNetworkText={token?.networkName}
            handleNetworkLink={isOnNetwork ? null : () => handleNetworkLink(token)}
            amount={token?.oraclesLocked.toFixed()}
            symbol={token?.symbol}
          />
        ))}
    </FlexColumn>
  );
}