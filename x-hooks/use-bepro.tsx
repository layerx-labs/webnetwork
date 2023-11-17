import { TreasuryInfo } from "@taikai/dappkit";
import {TransactionReceipt} from "@taikai/dappkit/dist/src/interfaces/web3-core";
import BigNumber from "bignumber.js";
import {useTranslation} from "next-i18next";

import {useAppState} from "contexts/app-state";

import {parseTransaction} from "helpers/transactions";

import {NetworkEvents} from "interfaces/enums/events";
import {TransactionStatus} from "interfaces/enums/transaction-status";
import {TransactionTypes} from "interfaces/enums/transaction-types";
import { Token } from "interfaces/token";
import {SimpleBlockTransactionPayload, TransactionCurrency} from "interfaces/transaction";

import DAO from "services/dao-service";

import {NetworkParameters} from "types/dappkit";

import { useDaoStore } from "./stores/dao/dao.store";
import {useProcessEvent} from "./api/events/use-process-event";
import {transactionStore} from "./stores/transaction-list/transaction.store";

const DIVISOR = 1000000;

export default function useBepro() {
  const { t } = useTranslation("common");

  const { state } = useAppState();
  const { service: daoService } = useDaoStore();
  const { processEvent } = useProcessEvent();
  const {add: addTx, update: updateTx} = transactionStore();

  const networkTokenSymbol = state.Service?.network?.active?.networkToken?.symbol || t("misc.$token");

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
        network: state.Service?.network?.active,
      });

      await daoService.disputeProposal(+issueContractId, +proposalContractId)
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
        network: state.Service?.network?.active
      });

      await daoService.updateConfigFees(closeFee, cancelFee)
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
        network: state.Service?.network?.active
      });

      await daoService.updateAmountNetworkCreation(amount)
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
        network: state.Service?.network?.active
      });

      await daoService.updateFeeNetworkCreation(amount)
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
        network: state.Service?.network?.active
      });

      await daoService.closeBounty(+bountyId, +proposalContractId, tokenUri)
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
                                          currency: string): Promise<TransactionReceipt | Error> {
    return new Promise(async (resolve, reject) => {
      const transaction = addTx({
        type: TransactionTypes.updateBountyAmount,
        network: state.Service?.network?.active,
        amount: amount,
        currency: currency
      });

      await daoService.updateBountyAmount(bountyId, amount)
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
        network: state.Service?.network?.active
      });

      let tx: { blockNumber: number; }

      await daoService.cancelBounty(contractId, funding)
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
        network: state.Service?.network?.active
      });

      let tx: { blockNumber: number; }

      await daoService.hardCancel(contractId)
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
        network: state.Service?.network?.active
      });

      await daoService
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

      const tx = addTx({ type, network: state.Service?.network?.active, amount, currency });

      await daoService.approveToken(tokenAddress, amount)
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
                                currency: TransactionCurrency): Promise<{ blockNumber: number; } | Error> {

    return new Promise(async (resolve, reject) => {
      const tx = addTx({
        type: TransactionTypes.takeBackOracles,
        amount,
        currency,
        network: state.Service?.network?.active
      });

      await daoService
        .takeBackDelegation(delegationId)
        .then((txInfo: { blockNumber: number; }) => {
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
        network: state.Service?.network?.active
      });

      await daoService?.createPullRequest( bountyId,
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
        network: state.Service?.network?.active
      });


      await daoService.setPullRequestReadyToReview(bountyId, pullRequestId)
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
        network: state.Service?.network?.active});

      await daoService.cancelPullRequest(bountyId, pullRequestId)
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
        network: state.Service?.network?.active
      })

      await daoService.refuseProposal(bountyId, proposalId)
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
        network: state.Service?.network?.active
      });

      await daoService.deployNetworkV2(networkToken)
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
                                      bountyToken: string): Promise<TransactionReceipt | Error> {
    return new Promise(async (resolve, reject) => {
      const transaction = addTx({
        type: TransactionTypes.deployNetworkRegistry,
        network: state.Service?.network?.active
      });

      await daoService.deployNetworkRegistry(erc20,
                                             lockAmountForNetworkCreation,
                                             treasury,
                                             BigNumber(lockFeePercentage).multipliedBy(DIVISOR).toString(),
                                             BigNumber(closeFee).multipliedBy(DIVISOR).toString(),
                                             BigNumber(cancelFee).multipliedBy(DIVISOR).toString(),
                                             bountyToken)
        .then((txInfo: Error | TransactionReceipt | PromiseLike<Error | TransactionReceipt>) => {
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
        network: state.Service?.network?.active
      });

      await daoService.setNFTTokenDispatcher(nftToken, networkAddress)
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
        network: state.Service?.network?.active
      });

      await daoService.addNetworkToRegistry(networkAddress)
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
        network: state.Service?.network?.active
      });

      await daoService.deployBountyToken(name, symbol)
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
      let service = daoService;

      if (networkAddress && networkAddress !== daoService?.network?.contractAddress) {
        service = new DAO({
          web3Connection: daoService.web3Connection,
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
        network: state.Service?.network?.active
      });

      await daoService.fundBounty(bountyId, amount, tokenDecimals)
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
        network: state.Service?.network?.active
      });

      await daoService.retractFundBounty(bountyId, fundingId)
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
        network: state.Service?.network?.active
      });

      await daoService.withdrawFundRewardBounty(bountyId, fundingId)
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
        network: state.Service?.network?.active
      });

      await daoService[( add ? 'addAllowedTokens' : 'removeAllowedTokens')](addresses, isTransactional)
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
        network: state.Service?.network?.active
      });

      await daoService?.unlockFromRegistry()
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
    return daoService.getERC20TokenData(address)
  }

  function isAddress(address: string): boolean {
    return daoService.isAddress(address)
  }

  function getCancelableTime(): Promise<number> {
    return daoService.getCancelableTime()
  }

  function getTimeChain(): Promise<number> {
    return daoService.getTimeChain()
  }

  function getTokenBalance(tokenAddress: string, walletAddress: string): Promise<BigNumber> {
    return daoService.getTokenBalance(tokenAddress, walletAddress)
  }

  function loadNetwork(networkAddress: string, skipAssignment?: boolean) {
    return daoService.loadNetwork(networkAddress, skipAssignment);
  }

  function isNetworkGovernor(walletAddress: string) {
    return daoService.isNetworkGovernor(walletAddress);
  }

  function getNetworkParameter(parameter: NetworkParameters) {
    return daoService.getNetworkParameter(parameter)
  }

  function getSettlerTokenData() {
    return daoService.getSettlerTokenData()
  }

  function setNetworkParameter(parameter: NetworkParameters, value: string | number) {
    return daoService.setNetworkParameter(parameter, value)
  }

  function lockInRegistry(amount: string) {
    return daoService.lockInRegistry(amount)
  }
  
  function approveTokenInRegistry(amount: string) {
    return daoService.approveTokenInRegistry(amount)
  }

  function unlockFromRegistry() {
    return daoService.unlockFromRegistry()
  }

  function getNetworkAdressByCreator(walletAddress: string) {
    return daoService.getNetworkAdressByCreator(walletAddress)
  }

  function isRegistryGovernor(walletAddress: string) {
    return daoService.isRegistryGovernor(walletAddress)
  }

  function getTokensLockedInRegistryByAddress(walletAddress: string) {
    return daoService.getTokensLockedInRegistryByAddress(walletAddress)
  }

  function getRegistryCreatorAmount() {
    return daoService.getRegistryCreatorAmount()
  }

  function getAllowance(tokenAddress: string, walletAddress: string, spenderAddress: string) {
    return daoService.getAllowance(tokenAddress, walletAddress, spenderAddress)
  }

  function deployERC20Token(name: string, symbol: string, cap: string, ownerAddress: string) {
    return daoService.deployERC20Token(name, symbol, cap, ownerAddress)
  }

  function treasuryInfo(): Promise<TreasuryInfo> {
    return daoService.network?.treasuryInfo()
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
