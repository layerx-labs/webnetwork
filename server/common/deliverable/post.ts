import {NextApiRequest, NextApiResponse} from "next";
import getConfig from "next/config";

import models from "db/models";

import {Settings} from "helpers/settings";

import ipfsService from "services/ipfs-service";

import {HttpBadRequestError, HttpNotFoundError, HttpServerError} from "../../errors/http-errors";

const {publicRuntimeConfig} = getConfig();

export default async function post(req: NextApiRequest, res: NextApiResponse) {

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

  const {hash} = await ipfsService.add(deliverableIpfs, true);

  if (!hash)
    throw new HttpBadRequestError("could not create deliverable on ipfs")

  const ipfsLink = `${defaultConfig.urls.ipfs}/${hash}`;

  const deliverable = await models.deliverable.create({
    issueId: issue.id,
    userId: context.user.id,
    network_id: issue?.network_id,
    ipfsLink,
    title,
    deliverableUrl,
    description,
  });

  return res.status(200).json({
    bountyId: issue.contractId,
    originCID: hash,
    cid: deliverable.id,
  });

}