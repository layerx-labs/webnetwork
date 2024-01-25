import getConfig from "next/config";
import { useRouter } from "next/router";

import NoWalletModalView from "components/modals/no-wallet-modal/no-wallet-modal.view";

import { walletExtensionsLinks } from "helpers/constants";

import { useLoadersStore } from "x-hooks/stores/loaders/loaders.store";
import useBreakPoint from "x-hooks/use-breakpoint";
import { useSettings } from "x-hooks/use-settings";

const { publicRuntimeConfig } = getConfig();

export default function NoWalletModal() {
  const { pathname } = useRouter();

  const { settings } = useSettings();
  const { isMobileView } = useBreakPoint(true);

  const { updateWeb3Dialog, web3Dialog } = useLoadersStore();

  const isRequired = [
    pathname?.includes("new-marketplace"),
    pathname?.includes("/profile")
  ].some(c => c);
  const availableWallets = settings?.availableWallets?.map(wallet => {
    const links = walletExtensionsLinks[wallet?.toLowerCase()];
    return {
      name: wallet?.toLowerCase(),
      links: {
        download: links?.download,
        deepLink: `${links?.deepLink}${publicRuntimeConfig?.urls?.home}`,
      }
    };
  });

  function handleClickTryAgain() {
    window.location.reload();
  }

  function handleCloseModal() {
    if (isRequired) return;
    updateWeb3Dialog(false);
  }

  return (
    <NoWalletModalView
      show={web3Dialog}
      availableWallets={availableWallets}
      isMobile={isMobileView}
      onCloseClick={handleCloseModal}
      onTryAgainClick={handleClickTryAgain}
    />
  );
}