import { NextApiRequest, NextApiResponse } from "next";
import { User } from "next-auth";
import { getSession } from "next-auth/react";
import getConfig from "next/config";
import { Sequelize } from "sequelize";

import models from "db/models";

import { resJsonMessage } from "helpers/res-json-message";
import { Settings } from "helpers/settings";

import ipfsService from "services/ipfs-service";

const {publicRuntimeConfig} = getConfig();

interface UserSession extends User {
  address: string;
}

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession({ req });

    const { address } = session as unknown as UserSession;

    const { deliverableUrl, title, description, issueId } = req.body;

    const settings = await models.settings.findAll({where: {visibility: "public", group: "urls"}, raw: true,});
    const defaultConfig = (new Settings(settings)).raw();

    if (!defaultConfig?.urls?.ipfs)
      return res.status(500).json("Missing ipfs url on settings");

    const issue = await models.issue.findOne({
      where: { id: issueId },
      include: [
        { association: "network" },
        { association: "chain" }
      ]
    });

    if (!issue) return res.status(404).json({ message: "issue not found" });

    const user = await models.user.findByAddress(address)

    if (!user) return res.status(404).json({ message: "user not found" });

    const { network, chain, githubId, repository_id } = issue
    const homeUrl = publicRuntimeConfig.urls.home
    const bountyUrl = `${homeUrl}/${network.name}/${chain.chainShortName}/bounty?id=${githubId}&repoId=${repository_id}`

    const deliverableIpfs = {
      name: "BEPRO deliverable",
      description,
      properties: {
        title,
        deliverableUrl,
        bountyUrl: bountyUrl
      },
    };

    const { hash } = await ipfsService.add(deliverableIpfs, true);

    if (!hash) return resJsonMessage('no hash found', res, 400);

    const ipfsLink = `${defaultConfig.urls.ipfs}/${hash}`;

    const deliverable = await models.deliverable.create({
      issueId: issue.id,
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
  } catch (error) {
    return res
      .status((error?.errors[0]?.type === "UNPROCESSABLE" && 422) || 500)
      .json(error?.errors || error);
  }
}