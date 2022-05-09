import { changeAccessToken } from "contexts/reducers/change-access-token";

export enum ReduceActionName {
  GithubHandle = "GithubHandle",
  MetaMaskWallet = "MetaMaskWallet",
  Loading = "Loading",
  BeproInit = "BeproInit",
  MyIssues = "MyIssues",
  Oracles = "Oracles",
  Staked = "Staked",
  ChangeAddress = "ChangeAddress",
  ChangeBalance = "ChangeBalance",
  AddToast = "AddToast",
  RemoveToast = "RemoveToast",
  MyTransactions = "MyTransactions",
  AddTransactions = "AddTransactions",
  UpdateTransaction = "UpdateTransaction",
  ChangeMicroServiceReadyState = "ChangeMicroServiceReadyState",
  ChangeNetwork = "ChangeNetwork",
  ChangeNetworkId = "ChangeNetworkId",
  GithubLogin = "GithubLogin",
  ChangeAccessToken = "ChangeAccessToken",
  ChangeTransactionalTokenApproval = "ChangeTransactionalTokenApproval",
  ChangeSettlerTokenApproval = "ChangeSettlerTokenApproval",
  ChangeNetworksSummary = "ChangeNetworksSummary",
  ClearTransactions = "ClearTransactions"
}
