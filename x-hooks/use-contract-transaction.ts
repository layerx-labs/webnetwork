import { useState } from "react";

import { TransactionReceipt } from "@taikai/dappkit/dist/src/interfaces/web3-core";
import { useTranslation } from "next-i18next";

import { MetamaskErrors } from "interfaces/enums/Errors";
import { NetworkEvents, RegistryEvents, StandAloneEvents } from "interfaces/enums/events";

import { useProcessEvent } from "x-hooks/api/events/use-process-event";
import { useToastStore } from "x-hooks/stores/toasts/toasts.store";

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

  const { processEvent } = useProcessEvent();
  const { addError, addSuccess } = useToastStore();

  function execute(...args: unknown[]): Promise<ExecutionResult> {
    return new Promise(async (resolve, reject) => {
      try {
        setIsExecuting(true);

        const tx = await method(...args);

        const eventsLogs = await processEvent(event, undefined, { fromBlock: tx.blockNumber });

        if (successMessage) addSuccess(t("actions.success"), successMessage);

        resolve({
          tx,
          eventsLogs,
        });
      } catch (error) {
        if (errorMessage && error?.code !== MetamaskErrors.UserRejected)
          addError(t("actions.failed"), errorMessage);

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