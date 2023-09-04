import { NextApiRequest, NextApiResponse } from "next";
import { Sequelize } from "sequelize";

import models from "db/models";

import { resJsonMessage } from "helpers/res-json-message";
import { Settings } from "helpers/settings";

import ipfsService from "services/ipfs-service";

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const headerWallet = (req.headers.wallet as string).toLowerCase();

    const { deliverableUrl, title, description, issueId } = req.body;

    const settings = await models.settings.findAll({where: {visibility: "public", group: "urls"}, raw: true,});
    const defaultConfig = (new Settings(settings)).raw();

    if (!defaultConfig?.urls?.ipfs)
      return res.status(500).json("Missing ipfs url on settings");

    const issue = await models.issue.findOne({
      where: { id: issueId },
    });

    if (!issue) return res.status(404).json({ message: "issue not found" });

    const user = await models.user.findOne({
      where: {
        address: Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("address")),
                                 "=",
                                 headerWallet),
      },
    });

    if (!user) return res.status(404).json({ message: "user not found" });

    const deliverableIpfs = {
      name: "BEPRO deliverable",
      description,
      properties: {
        title,
        deliverableUrl,
        bountyUrl: ""
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
      originCID: issue.issueId,
      cid: deliverable.id,
    });
  } catch (error) {
    return res
      .status((error?.errors[0]?.type === "UNPROCESSABLE" && 422) || 500)
      .json(error?.errors || error);
  }
}