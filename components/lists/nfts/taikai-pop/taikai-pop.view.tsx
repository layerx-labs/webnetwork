import {useTranslation} from "next-i18next";

import {AnkrNftAsset} from "types/ankr-nft-asset";

import If from "../../../If";
import {AnchorLink} from "../../../link/link";
import NothingFound from "../../../nothing-found";

export function TaikaiPopView({assets}: {assets: AnkrNftAsset[]}) {
  const { t } = useTranslation("profile");

  const url = (contractAddress: string, tokenId: string) =>
    `https://polygonscan.com/nft/${contractAddress}/${tokenId}`;

  return <>
    <div className="row gy-4 gx-4 mb-4">
      <If condition={!assets.length}>
        <div className="mt-5"> </div>
        <NothingFound description={t("not-found.taikai-pops")}/>
      </If>
      {
        assets.map(({tokenId, contractAddress, imageUrl, tokenUrl}, i) => (
          <div className="col-12 col-sm-6 col-md-4">
            <div className="d-flex p-3 flex-column align-items-center border border-radius-4 border-gray-800 comment">
              <img src={imageUrl} className="border-radius-8" data-testid="image-preview"/>
              <div className="d-flex justify-content-between w-100 mt-3 text-truncate text-blue-200">
                <AnchorLink url={url(contractAddress, tokenId)} label={t("goto.polygonscan")}
                            dataTestId={`taikai-pop-${i}`}/>
                <AnchorLink url={tokenUrl} label="Go to tokenUrl" dataTestId={`taikai-pop-token-url-${i}`}/>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  </>
}