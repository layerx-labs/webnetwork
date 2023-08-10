import Button, { ButtonProps } from "components/button";

import { useAppState } from "contexts/app-state";
import { changeNeedsToChangeChain, changeWalletMismatch } from "contexts/reducers/change-spinners";
import { changeShowWeb3 } from "contexts/reducers/update-show-prop";

import { UNSUPPORTED_CHAIN } from "helpers/constants";
import { AddressValidator } from "helpers/validators/address";

import { useDao } from "x-hooks/use-dao";

export default function ContractButton({
  onClick,
  children,
  ...rest
}: ButtonProps) {
  const { connect } = useDao();
  const { state, dispatch } = useAppState();

  async function validateEthereum() {
    if(window.ethereum) return true;

    dispatch(changeShowWeb3(true));

    return false;
  }

  async function validateChain() {
    if (state.connectedChain?.matchWithNetworkChain !== false || state.connectedChain?.name !== UNSUPPORTED_CHAIN)
      return true;

    dispatch(changeNeedsToChangeChain(true));

    return false;
  }

  async function validateWallet() {
    const web3Connection = state.Service?.web3Connection;
    const sessionWallet = state.currentUser?.walletAddress;

    if (!web3Connection || !sessionWallet) return false;

    const connectedWallet = web3Connection?.started ? await web3Connection.getAddress() : await connect();

    const isSameWallet = AddressValidator.compare(sessionWallet, connectedWallet);

    if (isSameWallet) return true;

    dispatch(changeWalletMismatch(true));

    return false;
  }

  async function handleExecute(e) {
    try {
      if (!onClick)
        throw new Error("Missing onClick callback");

      const validations: (() => Promise<boolean>)[] = [
        validateEthereum,
        validateChain,
        validateWallet,
      ];

      for (const validation of validations) {
        const isValidated = await validation();
        
        if (!isValidated)
          throw new Error(validation.name)
      }

      onClick(e);
    } catch (error) {
      console.debug("Contract Button", error);
    }
  }

  return(
    <Button
      onClick={handleExecute}
      {...rest}
    >
      {children}
    </Button>
  );
}