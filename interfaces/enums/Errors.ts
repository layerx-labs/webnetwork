export enum Errors {
  WalletNotConnected = "Wallet not connected"
}

export enum MetamaskErrors {
  UserRejected = 4001,
  ExceedAllowance = -32603
}

export enum EmailConfirmationErrors {
  ALREADY_CONFIRMED = "already-confirmed",
  INVALID_LINK = "invalid-link",
  EXPIRED_LINK = "expired-link"
}

export enum OriginLinkErrors {
  Banned = "banned",
  Invalid = "invalid"
}


export enum BadRequestErrors {
  BadRequest = "bad request",
  MissingParameters = "missing parameters",
  WrongParameters = "wrong parameters",
  WrongParamsNotAnAddress = "expected and address",
  WrongParamsNotANumber = "expected a number",
  WrongParamsNotUUID = "expected a UUID",
  WrongLength = "body parameter had the wrong length"
}

export enum ForbiddenErrors {
  Forbidden = "forbidden",
  NotTheOwner = "entry is owned by another user"
}


export enum NotFoundErrors {
  NotFound = "not found",
  NotificationNotFound = "notification not found"
}

export enum ConflictErrors {
  Conflict = "conflict"
}

export enum UnauthorizedErrors {
  Unauthorized = "unauthorized"
}