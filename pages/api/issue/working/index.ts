import {NextApiRequest, NextApiResponse} from "next";
import {Op} from "sequelize";

import models from "db/models";

import {chainFromHeader} from "helpers/chain-from-header";

import {LogAccess} from "middleware/log-access";
import {WithValidChainId} from "middleware/with-valid-chain-id";
import WithCors from "middleware/withCors";

import {Logger} from "services/logging";

async function put(req: NextApiRequest, res: NextApiResponse) {
  const { issueId, address, networkName } = req.body;

  const chain = await chainFromHeader(req);

  try {
    const network = await models.network.findOne({
      where: {
        name: {
          [Op.iLike]: String(networkName).replaceAll(" ", "-")
        },
        chain_id: { [Op.eq]: +chain?.chainId }
      }
    });

    if (!network) return res.status(404).json({message: "Invalid network"});

    const issue = await models.issue.findOne({
      where: { issueId, network_id: network.id }
    });

    if (!issue) return res.status(404).json({message: "Issue not found"});
    
    const user = await models.user.findOne({
      where: {
        address: address.toLowerCase()
      }
    })

    if(!user) return res.status(404).json({message: "User not found"});

    if (!issue.working.find((el) => +el === user.id)) {

      issue.working = [...issue.working, user.id];

      await issue.save();

      return res.status(200).json([...issue.working, user.id]);
    }

    return res.status(409).json({message: "Already working"});
  } catch (error) {
    return res
      .status(error.response?.status || 500)
      .json(error.response?.data || error);
  }
}

async function Working(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "put":
    await put(req, res);
    break;

  default:
    res.status(405);
  }

  res.end();
}

Logger.changeActionName(`Issue/Working`);
export default LogAccess(WithCors(WithValidChainId(Working)));
