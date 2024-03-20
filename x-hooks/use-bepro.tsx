import { TreasuryInfo } from "@taikai/dappkit";
import {TransactionReceipt} from "@taikai/dappkit/dist/src/interfaces/web3-core";
import BigNumber from "bignumber.js";
import {isZeroAddress} from "ethereumjs-util";
import {useTranslation} from "next-i18next";
import {isAddress as web3isAddress} from "web3-utils";

import {lowerCaseCompare} from "helpers/string";
import {parseTransaction} from "helpers/transactions";

import {NetworkEvents} from "interfaces/enums/events";
import {TransactionStatus} from "interfaces/enums/transaction-status";
import {TransactionTypes} from "interfaces/enums/transaction-types";
import { Token } from "interfaces/token";
import {SimpleBlockTransactionPayload, TransactionCurrency} from "interfaces/transaction";

import DAO from "services/dao-service";

import {NetworkParameters} from "types/dappkit";

import { useProcessEvent } from "x-hooks/api/events/use-process-event";
import { useDaoStore } from "x-hooks/stores/dao/dao.store";
import { transactionStore } from "x-hooks/stores/transaction-list/transaction.store";
import useMarketplace from "x-hooks/use-marketplace";

const DIVISOR = 1000000;

export default function useBepro() {
  const { t } = useTranslation("common");

  const { get } = useDaoStore();
  const marketplace = useMarketplace();
  const { processEvent } = useProcessEvent();
  const {add: addTx, update: updateTx} = transactionStore();

  const getService = () => get().service;
  const networkTokenSymbol = marketplace?.active?.networkToken?.symbol || t("misc.$token");
  const activeMarketplace = marketplace?.active;

  const failTx = (err, tx, reject?) => {
    updateTx({
      ...tx,
      status: err?.message?.search("User denied") > -1 ? TransactionStatus.rejected : TransactionStatus.failed
    });

    reject?.(err);
    console.error("Tx error", err);
  }

  async function handlerDisputeProposal(issueContractId: number,
                                        proposalContractId: number): Promise<TransactionReceipt> {
    return new Promise(async (resolve, reject) => {
      const disputeTxAction = addTx({
        type: TransactionTypes.dispute,
        network: activeMarketplace,
      });

      await getService().disputeProposal(+issueContractId, +proposalContractId)
        .then((txInfo: TransactionReceipt) => {
          updateTx(parseTransaction(txInfo, disputeTxAction as SimpleBlockTransactionPayload))
          resolve?.(txInfo);
        })
        .catch((err: { message: string; }) => {
          failTx(err, disputeTxAction, reject);
        });
    });
  }

  async function handleFeeSettings(closeFee: number, cancelFee: number): Promise<TransactionReceipt> {
    return new Promise(async (resolve, reject) => {
      const transaction = addTx({
        type: TransactionTypes.configFees,
        network: activeMarketplace
      });

      await getService().updateConfigFees(closeFee, cancelFee)
        .then((txInfo: TransactionReceipt) => {
          updateTx(parseTransaction(txInfo, transaction as SimpleBlockTransactionPayload))
          resolve(txInfo);
        })
        .catch((err: { message: string; }) => {
          failTx(err, transaction, reject);
        });
    });
  }

  async function handleAmountNetworkCreation(amount: string | number): Promise<TransactionReceipt> {
    return new Promise(async (resolve, reject) => {
      const transaction = addTx({
        type: TransactionTypes.amountForNetworkCreation,
        network: activeMarketplace
      });

      await getService().updateAmountNetworkCreation(amount)
        .then((txInfo: TransactionReceipt) => {
          updateTx(parseTransaction(txInfo, transaction as SimpleBlockTransactionPayload))
          resolve(txInfo);
        })
        .catch((err: { message: string; }) => {
          failTx(err, transaction, reject);
        });
    });
  }

  async function handleFeeNetworkCreation(amount: number): Promise<TransactionReceipt> {
    return new Promise(async (resolve, reject) => {
      const transaction = addTx({
        type: TransactionTypes.feeForNetworkCreation,
        network: activeMarketplace
      });

      await getService().updateFeeNetworkCreation(amount)
        .then((txInfo: TransactionReceipt) => {
          updateTx(parseTransaction(txInfo, transaction as SimpleBlockTransactionPayload))
          resolve(txInfo);
        })
        .catch((err: { message: string; }) => {
          failTx(err, transaction, reject);
        });
    });
  }

  async function handleCloseIssue(bountyId: number,
                                  proposalContractId: number,
                                  tokenUri: string): Promise<TransactionReceipt> {
    return new Promise(async (resolve, reject) => {
      const closeIssueTx = addTx({
        type: TransactionTypes.closeIssue,
        network: activeMarketplace
      });

      await getService().closeBounty(+bountyId, +proposalContractId, tokenUri)
        .then((txInfo: TransactionReceipt) => {
          updateTx(parseTransaction(txInfo, closeIssueTx as SimpleBlockTransactionPayload))
          resolve(txInfo);
        })
        .catch((err: { message: string; }) => {
          failTx(err, closeIssueTx, reject);
        });
    });
  }

  async function handleUpdateBountyAmount(bountyId: number,
                                          amount: string,
                                          currency: string,
                                          decimals: number): Promise<TransactionReceipt | Error> {
    return new Promise(async (resolve, reject) => {
      const transaction = addTx({
        type: TransactionTypes.updateBountyAmount,
        network: activeMarketplace,
        amount: amount,
        currency: currency
      });

      await getService().updateBountyAmount(bountyId, amount, decimals)
      .then((txInfo: Error | TransactionReceipt | PromiseLike<Error | TransactionReceipt>) => {
        updateTx(parseTransaction(txInfo, transaction as SimpleBlockTransactionPayload))
        resolve(txInfo);
      })
      .catch((err: { message: string; }) => {
        failTx(err, transaction, reject);
      });
    });
  }

  async function handleReedemIssue( contractId: number, 
                                    issueId: string, 
                                    funding = false): Promise<{ blockNumber: number; } | Error> {
    return new Promise(async (resolve, reject) => {
      const redeemTx = addTx({
        type: TransactionTypes.redeemIssue,
        network: activeMarketplace
      });

      let tx: { blockNumber: number; }

      await getService().cancelBounty(contractId, funding)
        .then((txInfo: { blockNumber: number; }) => {
          tx = txInfo;
          return processEvent(NetworkEvents.BountyCanceled, undefined, {
            fromBlock: txInfo.blockNumber, id: contractId
          });
        })
        .then((canceledBounties) => {
          if (!canceledBounties?.[issueId]) throw new Error('Failed');
          updateTx(parseTransaction(tx, redeemTx as SimpleBlockTransactionPayload))
          resolve(tx);
        })
        .catch((err: { message: string; }) => {
          failTx(err, redeemTx, reject);
        });
    })
  }
  
  async function handleHardCancelBounty(contractId?: number, issueId?: string): Promise<TransactionReceipt | Error> {
    return new Promise(async (resolve, reject) => {
      const transaction = addTx({
        type: TransactionTypes.redeemIssue,
        network: activeMarketplace
      });

      let tx: { blockNumber: number; }

      await getService().hardCancel(contractId)
        .then((txInfo: { blockNumber: number; }) => {
          tx = txInfo;

          return processEvent(NetworkEvents.BountyCanceled, undefined, {
            fromBlock: txInfo.blockNumber, 
            id: contractId
          });
        })
        .then((canceledBounties) => {
          if (!canceledBounties?.[issueId]) throw new Error('Failed');
          updateTx(parseTransaction(tx, transaction as SimpleBlockTransactionPayload))
          resolve(canceledBounties);
        })
        .catch((err: { message: string; }) => {
          failTx(err, transaction, reject);
        });
    })
  }

  async function handleProposeMerge(bountyId: number,
                                    pullRequestId: number,
                                    recipient: string): Promise<TransactionReceipt> {

    return new Promise(async (resolve, reject) => {

      const tx = addTx({
        type: TransactionTypes.proposeMerge,
        network: activeMarketplace
      });

      await getService()
        .createProposal(bountyId, pullRequestId, [recipient], [100])
        .then((txInfo: TransactionReceipt) => {
          updateTx(parseTransaction(txInfo, tx as SimpleBlockTransactionPayload))
          resolve(txInfo);
        })
        .catch((err: { message: string; }) => {
          failTx(err, tx, reject);
        });
    });
  }

  async function handleApproveToken(tokenAddress: string,
                                    amount: string,
                                    tokenType: "transactional" | "network" = "transactional",
                                    currency: string):
    Promise<TransactionReceipt | Error> {

    return new Promise(async (resolve, reject) => {
      const type = tokenType === "transactional" ?
        TransactionTypes.approveTransactionalERC20Token : TransactionTypes.approveSettlerToken ;

      const tx = addTx({ type, network: activeMarketplace, amount, currency });

      await getService().approveToken(tokenAddress, amount)
      .then((txInfo) => {
        if (!txInfo)
          throw new Error(t("errors.approve-transaction", {currency: networkTokenSymbol}));

        updateTx(parseTransaction(txInfo, tx as SimpleBlockTransactionPayload))
        resolve(txInfo);
      })
        .catch((err) => {
          failTx(err, tx, reject);
        });
    });
  }

  async function handleTakeBack(delegationId: number,
                                amount: string,
                                currency: TransactionCurrency): Promise<TransactionReceipt> {

    return new Promise(async (resolve, reject) => {
      const tx = addTx({
        type: TransactionTypes.takeBackOracles,
        amount,
        currency,
        network: activeMarketplace
      });

      await getService()
        .takeBackDelegation(delegationId)
        .then((txInfo: TransactionReceipt) => {
          if (!txInfo)
            throw new Error(t("errors.approve-transaction", {currency: networkTokenSymbol}));
          updateTx(parseTransaction(txInfo, tx as SimpleBlockTransactionPayload))

          processEvent(NetworkEvents.OraclesTransfer, undefined, {
            fromBlock: txInfo.blockNumber
          })
            .catch(console.debug);

          resolve(txInfo);
        })
        .catch((err: { message: string; }) => {
          failTx(err, tx, reject);
        });
    });
  }

  async function handleCreatePullRequest(bountyId: number,
                                         originCID: string,
                                         cid: number ): Promise<TransactionReceipt> {
    return new Promise(async (resolve, reject) => {
      const tx = addTx({
        type: TransactionTypes.createDeliverable,
        network: activeMarketplace
      });

      await getService()?.createPullRequest( bountyId,
                                             "",
                                             "",
                                             originCID,
                                             "",
                                             "",
                                             cid)
        .then((txInfo: TransactionReceipt) => {
          updateTx(parseTransaction(txInfo, tx as SimpleBlockTransactionPayload));
          resolve(txInfo);
        })
        .catch((error: { message: string; }) => {
          failTx(error, tx, reject);
        });
    });
  }

  async function handleMakePullRequestReady(bountyId: number, pullRequestId: number): Promise<TransactionReceipt> {
    return new Promise(async (resolve, reject) => {
      const tx = addTx({
        type: TransactionTypes.makeDeliverableReady,
        network: activeMarketplace
      });

      await getService().setPullRequestReadyToReview(bountyId, pullRequestId)
      .then((txInfo: TransactionReceipt) => {
        updateTx(parseTransaction(txInfo, tx as SimpleBlockTransactionPayload));
        resolve(txInfo);
      })
      .catch((error: { message: string; }) => {
        failTx(error, tx, reject);
      });
    });
  }

  async function handleCancelPullRequest(bountyId: number, pullRequestId: number): Promise<TransactionReceipt> {
    return new Promise(async (resolve, reject) => {
      const tx = addTx({
        type: TransactionTypes.cancelDeliverable,
        network: activeMarketplace
      });

      await getService().cancelPullRequest(bountyId, pullRequestId)
      .then((txInfo: TransactionReceipt) => {
        updateTx(parseTransaction(txInfo, tx as SimpleBlockTransactionPayload));
        resolve(txInfo);
      })
      .catch((error: { message: string; }) => {
        failTx(error, tx, reject);
      });
    });
  }

  async function handleRefuseByOwner(bountyId: number, proposalId: number): Promise<TransactionReceipt> {
    return new Promise(async (resolve, reject) => {
      const tx = addTx({
        type: TransactionTypes.refuseProposal,
        network: activeMarketplace
      })

      await getService().refuseProposal(bountyId, proposalId)
      .then((txInfo: TransactionReceipt) => {
        updateTx(parseTransaction(txInfo, tx as SimpleBlockTransactionPayload));
        resolve(txInfo);
      })
      .catch((error: { message: string; }) => {
        failTx(error, tx, reject);
      });
    });
  }

  async function handleDeployNetworkV2(networkToken: string): Promise<TransactionReceipt | Error> {
    return new Promise(async (resolve, reject) => {
      const transaction = addTx({
        type: TransactionTypes.deployNetworkV2,
        network: activeMarketplace
      });

      await getService().deployNetworkV2(networkToken)
        .then((txInfo: Error | TransactionReceipt | PromiseLike<Error | TransactionReceipt>) => {
          updateTx(parseTransaction(txInfo, transaction as SimpleBlockTransactionPayload));
          resolve(txInfo);
        })
        .catch((err: { message: string; }) => {
          failTx(err, transaction, reject);
        });
    });
  }

  async function handleDeployRegistry(erc20: string,
                                      lockAmountForNetworkCreation: string,
                                      treasury: string,
                                      lockFeePercentage: string,
                                      closeFee: string,
                                      cancelFee: string,
                                      bountyToken: string): Promise<TransactionReceipt> {
    return new Promise(async (resolve, reject) => {
      const transaction = addTx({
        type: TransactionTypes.deployNetworkRegistry,
        network: activeMarketplace
      });

      await getService().deployNetworkRegistry(erc20,
                                               lockAmountForNetworkCreation,
                                               treasury,
                                               BigNumber(lockFeePercentage).multipliedBy(DIVISOR).toString(),
                                               BigNumber(closeFee).multipliedBy(DIVISOR).toString(),
                                               BigNumber(cancelFee).multipliedBy(DIVISOR).toString(),
                                               bountyToken)
        .then((txInfo: TransactionReceipt) => {
          updateTx(parseTransaction(txInfo, transaction as SimpleBlockTransactionPayload));
          resolve(txInfo);
        })
        .catch((err: { message: string; }) => {
          failTx(err, transaction, reject);
        });
    });
  }

  async function handleSetDispatcher(nftToken: string, networkAddress: string): Promise<TransactionReceipt | Error> {
    return new Promise(async (resolve, reject) => {
      const transaction = addTx({
        type: TransactionTypes.setNFTDispatcher,
        network: activeMarketplace
      });

      await getService().setNFTTokenDispatcher(nftToken, networkAddress)
        .then((txInfo: Error | TransactionReceipt | PromiseLike<Error | TransactionReceipt>) => {
          updateTx(parseTransaction(txInfo, transaction as SimpleBlockTransactionPayload));
          resolve(txInfo);
        })
        .catch((err: { message: string; }) => {
          failTx(err, transaction, reject);
        });
    });
  }

  async function handleAddNetworkToRegistry(networkAddress: string): Promise<TransactionReceipt> {
    return new Promise(async (resolve, reject) => {
      const transaction = addTx({
        type: TransactionTypes.addNetworkToRegistry,
        network: activeMarketplace
      });

      await getService().addNetworkToRegistry(networkAddress)
        .then(txInfo => {
          updateTx(parseTransaction(txInfo, transaction as SimpleBlockTransactionPayload));
          resolve(txInfo);
        })
        .catch(err => {
          failTx(err, transaction, reject);
        });
    });
  }

  async function handleDeployBountyToken(name: string, symbol: string): Promise<TransactionReceipt> {
    return new Promise(async (resolve, reject) => {
      const transaction = addTx({
        type: TransactionTypes.deployBountyToken,
        network: activeMarketplace
      });

      await getService().deployBountyToken(name, symbol)
        .then((txInfo: TransactionReceipt) => {
          updateTx(parseTransaction(txInfo, transaction as SimpleBlockTransactionPayload));
          resolve(txInfo);
        })
        .catch((err: { message: string; }) => {
          failTx(err, transaction, reject);
        });
    });
  }

  async function handleChangeNetworkParameter(parameter: NetworkParameters,
                                              value: number | string,
                                              networkAddress?: string): Promise<TransactionReceipt> {
    return new Promise(async (resolve, reject) => {
      let service = getService();

      if (networkAddress && !lowerCaseCompare(networkAddress, getService()?.network?.contractAddress)) {
        service = new DAO({
          web3Connection: getService().web3Connection,
          skipWindowAssignment: true
        });

        await service.loadNetwork(networkAddress);
      }

      const transaction =
        addTx({ type: TransactionTypes[`set${parameter[0].toUpperCase() + parameter.slice(1)}`] });

      await service.setNetworkParameter(parameter, value)
        .then((txInfo: TransactionReceipt) => {
          updateTx(parseTransaction(txInfo, transaction as SimpleBlockTransactionPayload));
          resolve(txInfo);
        })
        .catch((err: { message: string; }) => {
          failTx(err, transaction, reject);
        });
    });
  }

  async function handleFundBounty(bountyId: number, 
                                  amount: string, 
                                  currency?: string, 
                                  tokenDecimals?: number): Promise<TransactionReceipt> {
    return new Promise(async (resolve, reject) => {
      const transaction = addTx({
        type: TransactionTypes.fundBounty,
        amount,
        currency,
        network: activeMarketplace
      });

      await getService().fundBounty(bountyId, amount, tokenDecimals)
        .then((txInfo: TransactionReceipt) => {
          updateTx(parseTransaction(txInfo, transaction as SimpleBlockTransactionPayload));
          resolve(txInfo);
        })
        .catch((err: { message: string; }) => {
          failTx(err, transaction, reject);
        });
    });
  }

  async function handleRetractFundBounty( bountyId: number, 
                                          fundingId: number,
                                          amount?: string,
                                          currency?: string): Promise<TransactionReceipt> {
    return new Promise(async (resolve, reject) => {
      const transaction = addTx({
        type: TransactionTypes.retractFundBounty,
        amount,
        currency,
        network: activeMarketplace
      });

      await getService().retractFundBounty(bountyId, fundingId)
        .then((txInfo: TransactionReceipt) => {
          updateTx(parseTransaction(txInfo, transaction as SimpleBlockTransactionPayload));
          resolve(txInfo);
        })
        .catch((err: { message: string; }) => {
          failTx(err, transaction, reject);
        });
    });
  }

  async function handleWithdrawFundRewardBounty(bountyId: number,
                                                fundingId: number,
                                                amount?: string,
                                                currency?: string): Promise<TransactionReceipt> {
    return new Promise(async (resolve, reject) => {
      const transaction = addTx({
        type: TransactionTypes.withdrawFundRewardBounty,
        amount,
        currency,
        network: activeMarketplace
      });

      await getService().withdrawFundRewardBounty(bountyId, fundingId)
        .then((txInfo: TransactionReceipt) => {
          updateTx(parseTransaction(txInfo, transaction as SimpleBlockTransactionPayload));
          resolve(txInfo);
        })
        .catch((err: { message: string; }) => {
          failTx(err, transaction, reject);
        });
    });
  }

  async function handleChangeAllowedTokens(addresses: string[], 
                                           isTransactional: boolean, 
                                           add = true): Promise<TransactionReceipt> {
    return new Promise(async (resolve, reject) => {

      const transaction = addTx({
        type: TransactionTypes.changeAllowedTokens,
        network: activeMarketplace
      });

      await getService()[( add ? 'addAllowedTokens' : 'removeAllowedTokens')](addresses, isTransactional)
        .then((txInfo: TransactionReceipt) => {
          updateTx(parseTransaction(txInfo, transaction as SimpleBlockTransactionPayload));
          resolve(txInfo);
        })
        .catch((err: { message: string; }) => {
          failTx(err, transaction, reject);
        });
    });
  }

  async function handleCloseNetwork() {
    return new Promise(async (resolve, reject) => {
      const transaction = addTx({
        type: TransactionTypes.closeNetwork,
        network: activeMarketplace
      });

      await getService()?.unlockFromRegistry()
        .then((txInfo: TransactionReceipt) => {
          updateTx(parseTransaction(txInfo, transaction as SimpleBlockTransactionPayload));
          resolve(txInfo);
        })
        .catch((err: { message: string; }) => {
          failTx(err, transaction, reject);
        });
    });
  }

  async function getERC20TokenData(address:string): Promise<Token> {
    return getService().getERC20TokenData(address)
  }

  function isAddress(address: string): boolean {
    return web3isAddress(address) && !isZeroAddress(address);
  }

  function getCancelableTime(): Promise<number> {
    return getService().getCancelableTime()
  }

  function getTimeChain(): Promise<number> {
    return getService().getTimeChain()
  }

  function getTokenBalance(tokenAddress: string, walletAddress: string): Promise<BigNumber> {
    return getService().getTokenBalance(tokenAddress, walletAddress)
  }

  function loadNetwork(networkAddress: string, skipAssignment?: boolean) {
    return getService().loadNetwork(networkAddress, skipAssignment);
  }

  function isNetworkGovernor(walletAddress: string) {
    return getService().isNetworkGovernor(walletAddress);
  }

  function getNetworkParameter(parameter: NetworkParameters) {
    return getService().getNetworkParameter(parameter)
  }

  function getSettlerTokenData() {
    return getService().getSettlerTokenData()
  }

  function setNetworkParameter(parameter: NetworkParameters, value: string | number) {
    return getService().setNetworkParameter(parameter, value)
  }

  function lockInRegistry(amount: string) {
    return getService().lockInRegistry(amount)
  }
  
  function approveTokenInRegistry(amount: string) {
    return getService().approveTokenInRegistry(amount)
  }

  function unlockFromRegistry() {
    return getService().unlockFromRegistry()
  }

  function getNetworkAdressByCreator(walletAddress: string) {
    return getService().getNetworkAdressByCreator(walletAddress)
  }

  function isRegistryGovernor(walletAddress: string) {
    return getService().isRegistryGovernor(walletAddress)
  }

  function getTokensLockedInRegistryByAddress(walletAddress: string) {
    return getService().getTokensLockedInRegistryByAddress(walletAddress)
  }

  function getRegistryCreatorAmount() {
    return getService().getRegistryCreatorAmount()
  }

  function getAllowance(tokenAddress: string, walletAddress: string, spenderAddress: string) {
    return getService().getAllowance(tokenAddress, walletAddress, spenderAddress)
  }

  function deployERC20Token(name: string, symbol: string, cap: string, ownerAddress: string) {
    return getService().deployERC20Token(name, symbol, cap, ownerAddress)
  }

  function treasuryInfo(): Promise<TreasuryInfo> {
    return getService().network?.treasuryInfo()
  }
  
  return {
    handlerDisputeProposal,
    handleCloseIssue,
    handleReedemIssue,
    handleProposeMerge,
    handleApproveToken,
    handleTakeBack,
    handleCreatePullRequest,
    handleMakePullRequestReady,
    handleUpdateBountyAmount,
    handleHardCancelBounty,
    handleCancelPullRequest,
    handleRefuseByOwner,
    handleDeployNetworkV2,
    handleSetDispatcher,
    handleAddNetworkToRegistry,
    handleDeployBountyToken,
    handleChangeNetworkParameter,
    handleFundBounty,
    handleRetractFundBounty,
    handleWithdrawFundRewardBounty,
    handleFeeSettings,
    handleDeployRegistry,
    handleChangeAllowedTokens,
    handleCloseNetwork,
    handleFeeNetworkCreation,
    handleAmountNetworkCreation,
    getERC20TokenData,
    getCancelableTime,
    getTokenBalance,
    getTimeChain,
    getNetworkParameter,
    getSettlerTokenData,
    getNetworkAdressByCreator,
    getTokensLockedInRegistryByAddress,
    getRegistryCreatorAmount,
    getAllowance,
    setNetworkParameter,
    isAddress,
    isNetworkGovernor,
    isRegistryGovernor,
    loadNetwork,
    lockInRegistry,
    approveTokenInRegistry,
    unlockFromRegistry,
    deployERC20Token,
    treasuryInfo
  };
}
