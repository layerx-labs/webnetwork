import {MutableRefObject, ReactChild, useEffect, useState} from "react";

import {useTranslation} from "next-i18next";

import Button from "components/button";
import NetworkTxButtonView from "components/common/network-tx-button/view";

import {formatNumberToCurrency} from "helpers/formatNumber";
import {parseTransaction} from "helpers/transactions";

import {MetamaskErrors} from "interfaces/enums/Errors";
import {TransactionStatus} from "interfaces/enums/transaction-status";
import {TransactionTypes} from "interfaces/enums/transaction-types";
import {SimpleBlockTransactionPayload} from "interfaces/transaction";

import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";
import {transactionStore} from "x-hooks/stores/transaction-list/transaction.store";
import { useUserStore } from "x-hooks/stores/user/user.store";
import {useAuthentication} from "x-hooks/use-authentication";
import useMarketplace from "x-hooks/use-marketplace";


interface NetworkTxButtonParams {
  txMethod: string;
  txParams: {
    from?: string;
    tokenAmount?: string;
  }
  onTxStart?: () => void;
  onSuccess: () => void;
  onFail: (message?: string) => void;
  modalTitle: string;
  modalDescription: string;
  buttonLabel?: string;
  handleEvent?: (blockNumber) => Promise<void> | void;
  buttonConfirmRef?: MutableRefObject<HTMLButtonElement>
  children?: ReactChild | ReactChild[];
  disabled?: boolean;
  txType: TransactionTypes;
  txCurrency: string;
  fullWidth?: boolean;
  className?: string;
}

export default function NetworkTxButton({
    txMethod,
    txParams,
    onSuccess,
    onFail,
    buttonLabel,
    modalTitle,
    modalDescription,
    className = "",
    children = null,
    fullWidth = false,
    disabled = false,
    txType = TransactionTypes.unknown,
    txCurrency,
    handleEvent,
    buttonConfirmRef
  }: NetworkTxButtonParams) {
  const { t } = useTranslation(["common"]);

  const [showModal, setShowModal] = useState(false);
  const [txSuccess,] = useState(false);

  const marketplace = useMarketplace();
  const {add: addTx, update: updateTx} = transactionStore();
  const { currentUser, updateCurrentUser } = useUserStore();

  const { addError, addSuccess } = useToastStore();
  const { service: daoService, get: getDao } = useDaoStore();
  const { updateWalletBalance } = useAuthentication();

  function checkForTxMethod() {
    const service = getDao().service;
    if (!service?.network || !currentUser) return;

    if (!txMethod || typeof service?.network[txMethod] !== "function")
      throw new Error("Wrong txMethod");
  }

  function makeTx() {
    const service = getDao().service;
    if (!service?.network || !currentUser || disabled) return;

    const tmpTransaction = addTx({
      type: txType,
      amount: txParams?.tokenAmount || "0",
      currency: txCurrency || t("misc.$token"),
      network: marketplace?.active
    });
    
    const methodName = txMethod === 'delegateOracles' ? 'delegate' : txMethod;
    const currency = txCurrency || t("misc.$token");

    service?.network[txMethod](txParams.tokenAmount, txParams.from)
      .then(async answer => {
        if (answer.status) {
          if (onSuccess) onSuccess();
          const content = 
            `${t(`transactions.types.${methodName}`)} ${formatNumberToCurrency(txParams?.tokenAmount)} ${currency}`;
          addSuccess(t("actions.success"), content);

          if(handleEvent && answer.blockNumber)
            await handleEvent(answer.blockNumber);

          updateTx(parseTransaction(answer, tmpTransaction as SimpleBlockTransactionPayload));
        } else {
          onFail(answer.message);
          addError(t("actions.failed"), answer?.message);
        }
      })
      .catch((e) => {

        updateTx({
          ...tmpTransaction,
          status: e?.code === MetamaskErrors.UserRejected ? TransactionStatus.rejected : TransactionStatus.failed,
        } as SimpleBlockTransactionPayload)

        console.error(`Failed network-tx-button`, e);

        onFail(e.message);
      })
      .finally(() => {
        updateWalletBalance(true);
        service.isCouncil(currentUser?.walletAddress).then((isCouncil) =>
          updateCurrentUser({
            isCouncil,
          }));
      });
  }

  function getButtonClass() {
    return `mt-3 ${fullWidth ? "w-100" : ""} ${
      (!children && !buttonLabel && "visually-hidden") || ""
    } ${className}`;
  }

  function getDivClass() {
    return `d-flex flex-column align-items-center text-${
      txSuccess ? "success" : "danger"
    }`;
  }

  const modalFooter = (
    <Button color="dark-gray" onClick={() => setShowModal(false)}> 
      {t("actions.close")}
    </Button>
  );

  useEffect(checkForTxMethod, [daoService, currentUser]);

  return (
      <NetworkTxButtonView 
        modalTitle={modalTitle} 
        modalDescription={modalDescription} 
        buttonLabel={buttonLabel} 
        disabled={disabled} 
        makeTx={makeTx} 
        buttonClass={getButtonClass()} 
        showModal={showModal}
        modalFooter={modalFooter} 
        divClassName={getDivClass()} 
        txSuccess={txSuccess}   
        ref={buttonConfirmRef}
      />
  );
}