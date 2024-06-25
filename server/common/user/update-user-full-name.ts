import { NextApiRequest } from "next";

import { BadRequestErrors } from "interfaces/enums/Errors";

import { HttpBadRequestError } from "server/errors/http-errors";

export async function updateUserFullName(req: NextApiRequest) {
  const { fullName, context: { user } } = req.body;

  if (fullName === undefined)
    throw new HttpBadRequestError(BadRequestErrors.MissingParameters);

  if (fullName && fullName.length > 125)
    throw new HttpBadRequestError(BadRequestErrors.WrongLength)

  await user.update({ fullName });
  await user.save();
}