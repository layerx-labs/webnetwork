import { useTranslation } from "next-i18next";

import ArrowUpRight from "assets/icons/arrow-up-right";

import If from "components/If";

interface NftsListItemViewProps {
  imageUrl: string;
  transactionUrl: string;
}

export default function NftsListItemView ({
  imageUrl,
  transactionUrl,
}: NftsListItemViewProps) {
  const { t } = useTranslation("common");
  
  return(
    <div className="d-flex p-3 flex-column align-items-center border border-radius-4 border-gray-800 comment">
      <If
        condition={!!imageUrl}
        otherwise={
          <span className="p-5 sm-regular text-gray-600">
            {t("open-graph-preview.no-preview")}
          </span>
        }
      >
        <img src={imageUrl} className="border-radius-8" data-testid="image-preview"/>
      </If>

      <div className="w-100 text-left mt-3 text-truncate text-blue-200">
        <a
          href={transactionUrl}
          target="_blank"
          rel="noopener noreferer"
          className="sm-regular text-decoration-none text-blue-200"
          data-testid="url-preview"
        >
          <span className="mr-1">
            {t("actions.view-on-explorer")}
          </span>

          <ArrowUpRight/>
        </a>
      </div>
    </div>
  );
}