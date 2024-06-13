import {BaseAPIError} from "server/errors/base-api-error";

import {
  BadRequestErrors,
  ConflictErrors,
  ForbiddenErrors,
  NotFoundErrors,
  UnauthorizedErrors
} from "../../interfaces/enums/Errors";

export class HttpNotFoundError extends BaseAPIError {
  constructor(message: string = NotFoundErrors.NotFound) {
    super(message, 404);
  }
}

export class HttpBadRequestError extends BaseAPIError {
  constructor(message: string = BadRequestErrors.BadRequest) {
    super(message, 400);
  }
}

export class HttpConflictError extends BaseAPIError {
  constructor(message: string = ConflictErrors.Conflict) {
    super(message, 409);
  }
}

export class HttpUnauthorizedError extends BaseAPIError {
  constructor(message: string = UnauthorizedErrors.Unauthorized) {
    super(message, 401);
  }
}

export class HttpForbiddenError extends BaseAPIError {
  constructor(message: string = ForbiddenErrors.Forbidden) {
    super(message, 403);
  }
}

export class HttpFileSizeError extends BaseAPIError {
  constructor(message: string = BadRequestErrors.BadRequest) {
    super(message, 413);
  }
}

export class HttpServerError extends BaseAPIError {
  constructor(message: string) {
    super(message, 500);
  }
}