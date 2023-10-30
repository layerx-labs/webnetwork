import React from "react";

import BigNumber from "bignumber.js";
import {useTranslation} from "next-i18next";

import Button from "components/button";
import TransactionStats from "components/transaction-stats";
import TransactionType from "components/transaction-type";
import {TransactionIcon} from "components/transactions-icon";

import {formatNumberToNScale, formatStringToCurrency} from "helpers/formatNumber";

import {Transaction} from "interfaces/transaction";

import {useStorageTransactions} from "../x-hooks/use-storage-transactions";

import TokenSymbolView from "./common/token-symbol/view";
import {transactionStore} from "../x-hooks/stores/transaction-list/transaction.store";
import If from "./If";

interface TransactionListProps {
  onActiveTransactionChange: (transaction: Transaction) => void
}

export default function TransactionsList({onActiveTransactionChange}: TransactionListProps) {
  const {t} = useTranslation("common");

  const {deleteFromStorage} = useStorageTransactions();
  const {list: transactions} = transactionStore();

  function renderTransactionRow(item: Transaction) {
    const className = "h-100 w-100 px-3 py-2 tx-row mt-2 cursor-pointer";

    const bnAmount = BigNumber(item.amount);

    const amount = bnAmount.gt(1)
      ? formatNumberToNScale(bnAmount.toFixed(), 2, '')
      : bnAmount.lt(0.000001)
        ? "less than 0.000001"
        : bnAmount.toFixed()

    return (
      <div className={className}
           onClick={() => onActiveTransactionChange(item)}
           key={item.id}>
        <div className="d-flex justify-content-start align-items-center">
          <TransactionIcon type={item.type}/>

          <div className="ms-3 me-auto">
            <TransactionType type={item.type}/>

            <If condition={item.amount > 0}>
              <span className="d-flex caption-medium text-gray text-uppercase">
                {formatStringToCurrency(amount)} <TokenSymbolView name={item.currency} className="ms-1"/>
              </span>
            </If>

          </div>

          <TransactionStats status={item.status}/>
        </div>
      </div>
    );
  }


  return (
    <div className="transaction-list w-100">
      <div className="d-flex flex-row justify-content-between">
        <h4 className="h4 m-0 text-white">{t("transactions.title_other")}</h4>
        <If condition={!!transactions.length}>
          <Button textClass="text-danger"
                  className="px-0"
                  onClick={deleteFromStorage}
                  transparent>
            {t("actions.clear-all")}
          </Button>
        </If>
      </div>

      <div className="overflow-auto tx-container mt-1 pt-2">

        <If condition={(!transactions || !transactions.length)}>
          <div className="text-center">
            <span className="caption-small text-light-gray text-uppercase fs-8 family-Medium">
              {t("transactions.no-transactions")}
            </span>
          </div>
        </If>

        {transactions.map(renderTransactionRow)}
      </div>
    </div>
  );
}
