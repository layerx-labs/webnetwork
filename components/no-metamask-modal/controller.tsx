import { useTranslation } from "next-i18next";
import getConfig from "next/config";
import { useRouter } from "next/router";

import Button from "components/button";
import NoMetamaskModalView from "components/no-metamask-modal/view";


import { useLoadersStore } from "x-hooks/stores/loaders/loaders.store";
import useBreakPoint from "x-hooks/use-breakpoint";

const { publicRuntimeConfig } = getConfig();

export default function NoMetamaskModal() {
  const { pathname } = useRouter();
  const { t } = useTranslation("common");

  const { isMobileView } = useBreakPoint(true);

  const { updateWeb3Dialog, web3Dialog } = useLoadersStore();

  const isRequired = [
    pathname?.includes("new-marketplace"),
    pathname?.includes("/[network]/[chain]/profile")
  ].some(c => c);

  function handleClickTryAgain() {
    window.location.reload();
  }

  const modalProps = {
    "true": {
      title: t("modals.mobile-information.title"),
      description: t("modals.mobile-information.description"),
      actions: <>
        <a
          className="text-decoration-none"
          href={`https://metamask.app.link/dapp/${publicRuntimeConfig?.urls?.home}`} 
          rel="noopener noreferrer"
        >
          <Button>{t("modals.mobile-information.open-in-metamask")}</Button>
        </a>
      </>
    },
    "false": {
      title: t("modals.web3-dialog.title"),
      description: t("modals.web3-dialog.message"),
      warning: t("modals.web3-dialog.eth-not-available"),
      actions: <>
        <a
          className="text-decoration-none"
          href="https://metamask.io/download.html"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Button color="dark-gray">{t("actions.install")}</Button>
        </a>
        <Button onClick={handleClickTryAgain}>
          {t("actions.try-again")}
        </Button>
      </>
    }
  };

  function handleCloseModal() {
    if (isRequired) return null;

    return () => updateWeb3Dialog(false)
  }

  return (
    <NoMetamaskModalView
      show={web3Dialog}
      onCloseClick={handleCloseModal()}
      {...modalProps[isMobileView.toString()]}
    />
  );
}