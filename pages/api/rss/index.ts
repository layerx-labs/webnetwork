import cache from "memory-cache";
import {NextApiRequest, NextApiResponse} from "next";
import getConfig from "next/config";
import {Op} from "sequelize";

import models from "db/models";

import {LogAccess} from "middleware/log-access";

import {HttpBadRequestError} from "server/errors/http-errors";
import {GeneralTemplates} from "server/templates";
import {TemplateProcessor} from "server/utils/template";

const {publicRuntimeConfig} = getConfig();

const convertMinutesToMs = minutes => +minutes * 60 * 1000;
const getCacheKey = (type, limit) => `RSS:${type}:${limit}`;

async function get(req: NextApiRequest) {
  const {type = "all", limit = 50} = req.query;

  if (!["open", "closed", "all"].includes(type.toString()))
    throw new HttpBadRequestError("type must be open, closed or all")

  const cachedData = cache.get(getCacheKey(type, limit));

  if (cachedData)
    return cachedData;

  let where = {};

  if (type === "open")
    where = {
      state: {
        [Op.notIn]: ["draft", "closed", "canceled", "pending"]
      }
    };
  else if (type === "closed")
    where = {
      state: "closed"
    };
  else
    where = {
      state: {
        [Op.notIn]: ["canceled", "pending"]
      }
    };

  const bounties = await models.issue.findAll({
    where,
    limit: limit,
    include: [
      {association: "network"},
      {association: "chain"}
    ]
  });

  const homeUrl = publicRuntimeConfig?.urls?.home;
  const ipfsUrl = publicRuntimeConfig?.urls?.ipfs;

  const templateData = {
    appTitle: "Task-Based Marketplace",
    appDescription: "Connecting organizations and builders through task-based work.",
    appLink: homeUrl,
    bounties: bounties.map(({title, createdAt, id, seoImage, tags, network, chain}) => ({
      title,
      description: `Created on ${network.name} Network.`,
      creationDate: new Date(createdAt).toUTCString(),
      link: `${homeUrl}/${network.name}/${chain.chainShortName}/task/${id}`,
      seoUrl: `${ipfsUrl}/${seoImage}`,
      tags: (tags || []).map(tag => ({tag}))
    }))
  };

  const result = await new TemplateProcessor(GeneralTemplates.RSS).compile(templateData);

  const ttlSetting = await models.settings.findAll({
    where: {
      key: "rssTtl",
      visibility: "public"
    },
    raw: true,
  });

  const TTL = convertMinutesToMs(ttlSetting.value || 1);

  cache.put(getCacheKey(type, limit), result, TTL);

  return result;

}

export default LogAccess(async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "get":
    res.status(200).json(await get(req));
    break;

  default:
    res.status(405).json("Method not allowed");
  }

  res.end();
})
