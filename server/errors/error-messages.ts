export enum ErrorMessages {
  NetworkNotFound = "network not found",
  UserNotAllowed = "user is not allowed",
  UserAllowed = "user is already allowed",
  InvalidPayload = "invalid payload",
  NoNetworkFound = "invalid network",
  CreateBountyNotAllowList = "User is not on create-task allow-list",
}

export enum UserEmailErrors {
  InvalidEmail = "invalid-email",
  EmailAlreadyInUse = "email-already-in-use",
  NothingToChange = "nothing-to-change",
}

export enum ChainCastErrors { 
  InvalidOperation = "invalid operation",
  MissingParameters = "missing parameters",
  InvalidAddress = "invalid address",
}