import { NextApiRequest } from "next";

import { updateAllowListByType } from "helpers/api/marketplace/management/update-allow-list";

import { AllowListTypes } from "interfaces/enums/marketplace";

export default async function (req: NextApiRequest) {
  const networkId = req?.query?.networkId;
  const type = req?.query?.type?.toString() as AllowListTypes;
  const address =
    !req.query?.address ? "" : typeof req.query.address !== "string" ? req.query.address.join() : req.query.address;

  return updateAllowListByType(address, +networkId, type, "remove");
}