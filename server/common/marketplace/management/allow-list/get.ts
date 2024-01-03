import { NextApiRequest } from "next";
import { isAddress } from "web3-utils";

import Database from "db/models";

import { getAllowListColumnFromType } from "helpers/marketplace";
import { toLower } from "helpers/string";

import { AllowListTypes } from "interfaces/enums/marketplace";

import { ErrorMessages } from "server/errors/error-messages";
import { HttpBadRequestError } from "server/errors/http-errors";

export default async function get (req: NextApiRequest) {
  const networkId = req?.query?.networkId;
  const type = req?.query?.type?.toString() as AllowListTypes;
  const isValidType = Object.values(AllowListTypes).includes(type);
  const address = !req.query?.address ? "" :
    typeof req.query.address !== "string" ? req.query.address.join() : req.query.address;

  if (!networkId || !type || !isValidType || (address && !isAddress(address)))
    throw new HttpBadRequestError(ErrorMessages.InvalidPayload);

  const listColumn = getAllowListColumnFromType(type);
  const result = await Database.network.findOne({
    attributes: [listColumn],
    where: {
      id: networkId,
    }
  });

  if (!result)
    throw new HttpBadRequestError(ErrorMessages.NoNetworkFound)

  return address
    ? {allowed: !result[listColumn].length ? true : result[listColumn].map(toLower).includes(toLower(address))}
    : result[listColumn];
}