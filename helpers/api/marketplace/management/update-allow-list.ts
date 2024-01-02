import { isAddress } from "web3-utils";

import Database from "db/models";

import { getAllowListColumnFromType } from "helpers/marketplace";
import { lowerCaseCompare, lowerCaseIncludes } from "helpers/string";

import { AllowListTypes } from "interfaces/enums/marketplace";

import { ErrorMessages } from "server/errors/error-messages";
import { HttpBadRequestError } from "server/errors/http-errors";

export async function updateAllowListByType (address: string,
                                             networkId: number,
                                             type: AllowListTypes,
                                             operation: "add" | "remove"): Promise<string[]> {
  const isValidType = Object.values(AllowListTypes).includes(type);

  if (!address || !networkId || (address && !isAddress(address as string)) || !type || !isValidType)
    throw new HttpBadRequestError(ErrorMessages.InvalidPayload);

  const listColumn = getAllowListColumnFromType(type);

  const network = await Database.network.findOne({
    attributes: [listColumn],
    where: {
      id: networkId,
    }
  });

  if (!network)
    throw new HttpBadRequestError(ErrorMessages.NetworkNotFound);

  const isPresentOnList = lowerCaseIncludes(address, network[listColumn] || []);

  if (operation === "add" && isPresentOnList)
    throw new HttpBadRequestError(ErrorMessages.UserAllowed);
  else if (operation === "remove" && !isPresentOnList)
    throw new HttpBadRequestError(ErrorMessages.UserNotAllowed);

  const newList = [];

  if (operation === "add")
    newList.push(...[...network[listColumn], address]);
  else if (operation === "remove")
    newList.push(...network[listColumn].filter(_a => !lowerCaseCompare(_a, address)));

  const [, updatedNetwork] = await Database.network.update({
    [listColumn]: newList,
  }, {
    where: {
      id: networkId,
    },
    returning: true,
  });

  return updatedNetwork[listColumn];
}