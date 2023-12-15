import {NextApiRequest, NextApiResponse} from "next";
import {isAddress} from "web3-utils";

import Database from "db/models";

import {lowerCaseIncludes} from "helpers/string";

import {ErrorMessages} from "server/errors/error-messages";
import {HttpBadRequestError} from "server/errors/http-errors";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const address =
    !req.query?.address ? "" : typeof req.query.address !== "string" ? req.query.address.join() : req.query.address;
  const type = ["open", "close"].includes(req.query?.type?.toString()) ? req.query?.type?.toString() : null;

  if (!address || !req.query?.networkId || (address && !isAddress(address as string)) || !type)
    throw new HttpBadRequestError(ErrorMessages.InvalidPayload);

  const result = await Database.network.findOne({
    attributes: ["allow_list", "close_task_allow_list"],
    where: {
      id: req.query.networkId,
    }
  });

  const isCloseList = type === "close";
  const columnName = isCloseList ? "close_task_allow_list" : "allow_list";

  if (!result || lowerCaseIncludes(address, result[columnName] || []))
    throw new HttpBadRequestError(ErrorMessages.NoNetworkFoundOrUserAllowed);

  const [, updatedAllowList] = await Database.network.update({
    [columnName]: [...result[columnName], address],
  }, {
    where: {
      id: req.query.networkId,
      // no need to exclude from allow_list again
    },
    returning: true,
  });

  return updatedAllowList[columnName]; // an array of the new values
}