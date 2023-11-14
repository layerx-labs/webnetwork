import {useTranslation} from "next-i18next";
import Link from "next/link";

import CustomContainer from "components/custom-container";
import HorizontalScroll from "components/horizontal-scroll/controller";
import If from "components/If";
import { 
  ActiveMarketplaceItem 
} from "components/lists/active-marketplaces/active-marketplace-item/active-marketplace-item.controller";
import NothingFound from "components/nothing-found";

import { ActiveMarketplace } from "types/api";


interface ActiveMarketplacesListProps {
  marketplaces: ActiveMarketplace[];
}
export default function ActiveMarketplacesList({
  marketplaces
}: ActiveMarketplacesListProps) {
  const { t } = useTranslation(["bounty"]);

  return (
    <CustomContainer className="mb-3 px-xl-0">
      <div className="d-flex mt-2 px-1 justify-content-between">
        <h4 className="mt-1 font-weight-medium">{t("most-active-networks")}</h4>
        <Link href={"/marketplaces"}>
          <a className="text-decoration-none text-primary mt-2"
             rel="noreferrer">
            {t("explore-all")}
          </a>
        </Link>
      </div>

      <div className="row mt-1">
        <If
          condition={!!marketplaces.length}
          otherwise={<NothingFound description={t("most-active-network-empty")} />}
        >
          <HorizontalScroll>
            {marketplaces.map((marketplace, index) => 
              <div
                className="col-12 col-sm-6 col-md-5 col-lg-4"
                key={`active-${index}-${marketplace?.name}`}
              >
                <ActiveMarketplaceItem marketplace={marketplace} key={`${marketplace.name}`} />
              </div>)}
          </HorizontalScroll>
        </If>
      </div>
    </CustomContainer>
  );
}
