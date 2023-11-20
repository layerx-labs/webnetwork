import { useTranslation } from "next-i18next";

import ChainIcon from "components/chain-icon";
import Modal from "components/modal";

import { SupportedChainData } from "interfaces/supported-chain-data";

interface ActiveMarketplaceChainsModalProps {
  show: boolean;
  chains: Partial<SupportedChainData>[];
  onCloseClick: () => void;
}

export function ActiveMarketplaceChainsModal({
  show,
  chains,
  onCloseClick,
}: ActiveMarketplaceChainsModalProps) {
  const { t } = useTranslation("common");

  return(
    <Modal
      show={show}
      onCloseClick={onCloseClick}
      backdrop={true}
      title={t("misc.available-on")}
    >
      <div className="row">
        <div className="col">
          {chains?.map(chain => 
            <div className="row mb-1" key={chain?.chainId}>
              <div className="col-auto">
              <ChainIcon
                src={chain?.icon}
                size="22"
                className="circle-2"
              />
              </div>

              <div className="col-auto px-0">
                <span className="text-capitalize text-white">
                  {chain?.chainName}
                </span> 
              </div>
            </div>)
          }
        </div>
      </div>
    </Modal>
  );
}