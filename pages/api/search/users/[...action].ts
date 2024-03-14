import {NextApiRequest, NextApiResponse} from "next";
import {getToken} from "next-auth/jwt";
import getConfig from "next/config";
import {Op, Sequelize} from "sequelize";

import models from "db/models";

import paginate from "helpers/paginate";
import {lowerCaseCompare} from "helpers/string";

import {UserTableScopes} from "interfaces/enums/api";

import {withCORS} from "middleware";

import {JwtToken} from "server/auth/types";
import {UserRoleUtils} from "server/utils/jwt";

const {serverRuntimeConfig} = getConfig();

async function post(req: NextApiRequest, res: NextApiResponse) {

  const {
    action: [action]
  } = req.query;

  const whereCondition = {
    all: {
      [Op.or]: [
        {address: (req?.body[0]?.toLowerCase())},
        {handle: req?.body[1]}
      ]
    },
    login: {handle: {[Op.in]: req.body || []}},
    address: Sequelize.where(Sequelize.fn("lower", Sequelize.col("user.address")),
                             Op.in,
                             Sequelize.literal(`('${(req.body || []).map((s) => s?.toLowerCase()).join("','")}')`))
  };

  const queryOptions = {
    raw: true,
    attributes: {
      exclude: ["resetedAt", "createdAt", "updatedAt"]
    },
    where: whereCondition[action]
  };

  const token = (await getToken({req, secret: serverRuntimeConfig?.auth?.secret})) as JwtToken;

  let scope = UserTableScopes.default;

  const isAdmin = UserRoleUtils.hasAdminRole(token);
  const isGovernor = UserRoleUtils.hasGovernorRole(token);
  const isSameUser = !!token?.address && lowerCaseCompare(token?.address, req?.body[0]) ||
    !!token?.login && lowerCaseCompare(token?.login, req?.body[1]);

  if (isAdmin)
    scope = UserTableScopes.admin;
  else if (isGovernor || isSameUser)
    scope = UserTableScopes.ownerOrGovernor;


  return models.user.scope(scope).findAll(paginate(queryOptions, req.body));

}

async function SearchUsers(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "post":
    res.status(200).json(await post(req, res));
    break;

  default:
    res.status(405);
  }

  res.end();
}

export default withCORS(SearchUsers);
