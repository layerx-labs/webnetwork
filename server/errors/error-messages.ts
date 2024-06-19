export enum ErrorMessages {
  NetworkNotFound = "network not found",
  UserNotAllowed = "user is not allowed",
  UserAllowed = "user is already allowed",
  InvalidPayload = "invalid payload",
  NoNetworkFound = "invalid network",
  CreateBountyNotAllowList = "User is not on create-task allow-list",
  FailedToCollectLog = "Failed to collect log",
  CollectorUnknown = "Unknown collector",
  FailedToCollectEmailNotification = "Failed to collect email notification",
  UnknownTemplateCompiler = "Unknown template compiler"
}

export enum UserEmailErrors {
  InvalidEmail = "invalid-email",
  EmailAlreadyInUse = "email-already-in-use",
  NothingToChange = "nothing-to-change",
}