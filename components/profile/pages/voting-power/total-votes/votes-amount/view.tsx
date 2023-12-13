import {useTranslation} from "next-i18next";

import If from "components/If";
import VotesItem from "components/profile/pages/voting-power/votes-item/votes-item.view";

import {Curator} from "interfaces/curators";

interface VotesAmountProps {
  label: string;
  curators: Curator[];
  className?: string;
  type: "tokensLocked" | "delegatedToMe"
}

export default function VotesAmount({
  label,
  curators,
  className,
  type
}: VotesAmountProps) {
  const { t } = useTranslation("profile");

  return(
    <div className={`row ${className}`}>
      <div className="col">
        <div className="caption-large text-capitalize family-Regular text-white font-weight-500 mb-3">
          <span>{label}</span>
        </div>

        <div className="row mx-0">
          <If
            otherwise={
              <div className="bg-gray-900 border-radius-4 px-3 py-4 text-center">
               <span className="base-medium text-white font-weight-normal">
                 {t("no-votes-found")}
               </span>
              </div>
            }
            condition={!!curators?.length}
          >
            <div className="col">
              {
                curators?.map(curator =>
                  <VotesItem
                    key={`${curator?.address}-${curator?.network?.name}-${curator?.network?.chain?.chainShortName}`}
                    networkLogo={curator?.network?.logoIcon}
                    networkName={curator?.network?.name}
                    chainLogo={curator?.network?.chain?.icon}
                    chainName={curator?.network?.chain?.chainShortName}
                    amount={curator[type] || "0"}
                    tokenSymbol={curator?.network?.networkToken?.symbol}
                  />)
              }
            </div>
          </If>
        </div>
      </div>
    </div>
  );
}