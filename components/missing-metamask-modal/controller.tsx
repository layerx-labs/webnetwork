import { useRouter } from "next/router";

import { useLoadersStore } from "x-hooks/stores/loaders/loaders.store";

import MissingMetamaskModalView from "./view";

export default function MissingMetamaskModal() {
  const { asPath, push } = useRouter();
  const { missingMetamask, updateMissingMetamask } = useLoadersStore();

  function handleReload() {
    push(asPath);
  }

  function handleClose() {
    updateMissingMetamask(false)
  }

  return (
    <MissingMetamaskModalView
      show={missingMetamask}
      handleReload={handleReload}
      handleClose={handleClose}
    />
  );
}
