import { useState } from "react";

import { TransactionReceipt } from "@taikai/dappkit/dist/src/interfaces/web3-core";

import { NetworkEvents, RegistryEvents } from "interfaces/enums/events";

import useApi from "x-hooks/use-api";

interface ExecutionResult {
  tx: TransactionReceipt;
  eventsLogs: unknown;
}

export default function useContractTransaction( event: RegistryEvents | NetworkEvents,
                                                method: (...args) => Promise<TransactionReceipt>) {
  const [isExecuting, setIsExecuting] = useState(false);

  const { processEvent } = useApi();

  function execute(...args): Promise<ExecutionResult> {
    return new Promise(async (resolve, reject) => {
      try {
        setIsExecuting(true);

        const tx = await method(...args);

        const eventsLogs = await processEvent(event, undefined, { fromBlock: tx.blockNumber });

        resolve({
          tx,
          eventsLogs,
        });
      } catch (error) {
        setIsExecuting(false);
        reject(error);
      }
    });
  }

  return {
    isExecuting,
    execute,
  };
}