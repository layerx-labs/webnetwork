import React, {useEffect, useState} from "react";
import {OverlayTrigger, Popover} from "react-bootstrap";

import TransactionIcon from "assets/icons/transaction";

import Button from "components/button";
import TransactionModal from "components/transaction-modal";
import TransactionsList from "components/transactions-list";

import {useAppState} from "contexts/app-state";

import {TransactionStatus} from "interfaces/enums/transaction-status";
import {Transaction} from "interfaces/transaction";
import {useStorageTransactions} from "../x-hooks/use-storage-transactions";
import {transactionStore} from "../x-hooks/stores/transaction-list/transaction.store";

export default function TransactionsStateIndicator() {
  const {state: {currentUser, connectedChain: {id: connectedChainId}}} = useAppState();

  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);

  const {loadFromStorage} = useStorageTransactions();
  const {list: transactions} = transactionStore();

  function updateLoadingState() {
    if (!transactions.length) {
      setLoading(false);
      return;
    }

    const loading = transactions.some(({ status }) => status === TransactionStatus.pending);

    setLoading(loading);
    setShowOverlay(loading);
  }

  function onActiveTransactionChange(transaction: Transaction) {
    setActiveTransaction(transaction);
    setShowOverlay(!!transaction);
  }

  function restoreTransactions() {
    if (!currentUser?.walletAddress || !connectedChainId)
      return;

    loadFromStorage();
  }

  useEffect(updateLoadingState, [transactions]);
  useEffect(restoreTransactions, [currentUser?.walletAddress, connectedChainId]);

  const overlay = (
    <Popover id="transactions-indicator">
      <Popover.Body className="bg-shadow p-3">
        <TransactionsList onActiveTransactionChange={onActiveTransactionChange} />
      </Popover.Body>
    </Popover>
  );

  return (
    <span>
      <OverlayTrigger
        trigger="click"
        placement={"bottom-end"}
        show={showOverlay}
        rootClose={true}
        onToggle={(next) => setShowOverlay(next)}
        overlay={overlay}>
        <div>
          <Button
            className="bg-gray-850 border-gray-850 rounded p-2"
            transparent
            onClick={() => setShowOverlay(!showOverlay)}
          >
            {(loading && (
              <span className="spinner-border spinner-border-sm" />
            )) || <TransactionIcon color="bg-opac" />}
          </Button>
        </div>
      </OverlayTrigger>
      <TransactionModal
        transaction={activeTransaction}
        onCloseClick={() => onActiveTransactionChange(null)}
      />
    </span>
  );
}
