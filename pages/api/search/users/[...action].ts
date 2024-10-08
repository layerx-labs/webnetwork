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

async function post(req: NextApiRequest) {
  const {
    action: [action]
  } = req.query;

  const { address, handle } = req.body;

  const addressWhere = Sequelize.where( Sequelize.fn("lower", Sequelize.col("user.address")),
                                        Op.eq,
                                        address?.toLowerCase());

  const handleWhere = Sequelize.where(Sequelize.fn("lower", Sequelize.col("user.handle")),
                                      Op.eq,
                                      handle?.toLowerCase()); 

  const whereCondition = {
    all: {
      [Op.or]: [
        addressWhere,
        handleWhere,
      ]
    },
    login: handleWhere,
    address: addressWhere,
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
  const isSameUser = !!token?.address && lowerCaseCompare(token?.address, address) ||
    !!token?.login && lowerCaseCompare(token?.login, handle);

  if (isAdmin)
    scope = UserTableScopes.admin;
  else if (isGovernor || isSameUser)
    scope = UserTableScopes.ownerOrGovernor;

  return models.user.scope(scope).findAll(paginate(queryOptions));
}

async function SearchUsers(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method.toLowerCase()) {
  case "post":
    res.status(200).json(await post(req));
    break;

  default:
    res.status(405);
  }

  res.end();
}

export default withCORS(SearchUsers);
