import {NextApiRequest} from "next";
import getConfig from "next/config";

import models from "db/models";

import {Settings} from "helpers/settings";

import ipfsService from "services/ipfs-service";
import { Logger } from "services/logging";

import {HttpBadRequestError, HttpNotFoundError, HttpServerError} from "server/errors/http-errors";

const {publicRuntimeConfig} = getConfig();

export default async function post(req: NextApiRequest) {

  const {deliverableUrl, title, description, issueId, context} = req.body;

  const settings = await models.settings.findAll({where: {visibility: "public", group: "urls"}, raw: true,});
  const defaultConfig = (new Settings(settings)).raw();

  if (!defaultConfig?.urls?.ipfs)
    throw new HttpServerError("missing ipfs url on settings")

  const issue = await models.issue.findOne({
    where: {id: issueId},
    include: [
      {association: "network"},
      {association: "chain"}
    ]
  });

  if (!issue)
    throw new HttpNotFoundError("issue not found")

  const {network, chain} = issue;
  const homeUrl = publicRuntimeConfig.urls.home;
  const bountyUrl = `${homeUrl}/${network.name}/${chain.chainShortName}/task/${issue.id}`;

  const deliverableIpfs = {
    name: "BEPRO deliverable",
    description,
    properties: {
      title,
      deliverableUrl,
      bountyUrl: bountyUrl
    },
  };

  const result = await ipfsService.add(deliverableIpfs, true)
  .catch(error => {
    Logger.error(error, "Failed to uppload to ipfs");
    return null;
  });

  if (!result?.hash)
    throw new HttpBadRequestError("could not create deliverable on ipfs")

  const ipfsLink = `${defaultConfig.urls.ipfs}/${result.hash}`;

  const deliverable = await models.deliverable.create({
    issueId: issue.id,
    userId: context.user.id,
    network_id: issue?.network_id,
    ipfsLink,
    title,
    deliverableUrl,
    description,
  });

  return {
    bountyId: issue.contractId,
    originCID: result.hash,
    cid: deliverable.id,
  }

}