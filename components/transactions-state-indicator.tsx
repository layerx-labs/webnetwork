import React, {useEffect, useState} from "react";
import {OverlayTrigger, Popover} from "react-bootstrap";

import TransactionIcon from "assets/icons/transaction";

import Button from "components/button";
import TransactionModal from "components/transaction-modal";
import TransactionsList from "components/transactions-list";

import {TransactionStatus} from "interfaces/enums/transaction-status";
import {Transaction} from "interfaces/transaction";

import {useUserStore} from "x-hooks/stores/user/user.store";
import useSupportedChain from "x-hooks/use-supported-chain";

import {transactionStore} from "../x-hooks/stores/transaction-list/transaction.store";
import useBreakPoint from "../x-hooks/use-breakpoint";
import {useStorageTransactions} from "../x-hooks/use-storage-transactions";

export default function TransactionsStateIndicator() {
  const { currentUser } = useUserStore();

  const [loading, setLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);

  const {loadFromStorage} = useStorageTransactions();
  const {list: transactions, isPending} = transactionStore();
  const { connectedChain } = useSupportedChain();

  const {isDesktopView} = useBreakPoint();

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
    if (!currentUser?.walletAddress || !connectedChain?.id)
      return;

    loadFromStorage();
  }

  useEffect(updateLoadingState, [transactions, isPending]);
  useEffect(restoreTransactions, [currentUser?.walletAddress, connectedChain]);

  const overlay = (
    <Popover id="transactions-indicator">
      <Popover.Body className="bg-gray-850 border border-gray-800 p-3">
        <TransactionsList onActiveTransactionChange={onActiveTransactionChange} />
      </Popover.Body>
    </Popover>
  );

  return (
    <span>
      <OverlayTrigger
        trigger="click"
        placement={isDesktopView ? "bottom-end" : "top-end"}
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
