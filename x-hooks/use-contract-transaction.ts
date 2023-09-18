import { useState } from "react";

import { TransactionReceipt } from "@taikai/dappkit/dist/src/interfaces/web3-core";
import { useTranslation } from "next-i18next";

import { useAppState } from "contexts/app-state";
import { toastError, toastSuccess } from "contexts/reducers/change-toaster";

import { MetamaskErrors } from "interfaces/enums/Errors";
import { NetworkEvents, RegistryEvents, StandAloneEvents } from "interfaces/enums/events";

import { useProcessEvent } from "./api/events/use-process-event";

interface ExecutionResult {
  tx: TransactionReceipt;
  eventsLogs: unknown;
}

type useContractTransactionHook = [boolean, (...args: unknown[]) => Promise<ExecutionResult>, (value: boolean) => void];

export default function useContractTransaction( event: RegistryEvents | NetworkEvents | StandAloneEvents,
                                                method: (...args) => Promise<TransactionReceipt>,
                                                successMessage?: string,
                                                errorMessage?: string): 
                                                useContractTransactionHook {
  const { t } = useTranslation("common");
  
  const [isExecuting, setIsExecuting] = useState(false);

  const { dispatch } = useAppState();

  function execute(...args: unknown[]): Promise<ExecutionResult> {
    return new Promise(async (resolve, reject) => {
      try {
        setIsExecuting(true);

        const tx = await method(...args);

        const eventsLogs = await useProcessEvent(event, undefined, { fromBlock: tx.blockNumber });

        if (successMessage) dispatch(toastSuccess(successMessage, t("actions.success")));

        resolve({
          tx,
          eventsLogs,
        });
      } catch (error) {
        if (errorMessage && error?.code !== MetamaskErrors.UserRejected)
          dispatch(toastError(errorMessage, t("actions.failed")));

        reject(error);
      } finally {
        setIsExecuting(false);
      }
    });
  }

  return [
    isExecuting,
    execute,
    setIsExecuting,
  ];
}