import { ParsedUrlQuery } from "querystring";
import { WhereOptions } from "sequelize";

import models from "db/models";
import Database from "db/models";

import { DEFAULT_ITEMS_PER_PAGE, calculateTotalPages } from "helpers/paginate";

export default async function get(query: ParsedUrlQuery) {
  const { address, page, search, sortBy, order, networkName } = query;

  const whereCondition: WhereOptions = {};

  if (address) whereCondition.address = address;

  const PAGE = +(page || 1);
  const OFFSET = (PAGE - 1) * DEFAULT_ITEMS_PER_PAGE;

  const leaderboardQuery = `
    SELECT
      address, 
      githubLogin,
      COUNT(issue) AS numberNfts,
      array_to_string(array_agg(DISTINCT "logoIcon"), ', ') AS networksLogos,
      array_to_string(array_agg(DISTINCT icon), ', ') AS chainsLogos
    FROM (
      SELECT 
        up.address,
        u."githubLogin" AS githubLogin,
        i.id AS issue, 
        n."logoIcon", 
        c.icon
      FROM 
        users_payments up
        INNER JOIN users u ON LOWER(u.address) = LOWER(up.address)
        INNER JOIN issues i ON i.id = up."issueId"
        INNER JOIN networks n ON n.id = i.network_id
        INNER JOIN chains c ON c."chainId" = i.chain_id
      WHERE 1 = 1
      ${
        search
          ? `AND (
              u.address ILIKE '%${search}%' OR
              u."githubLogin" ILIKE '%${search}%'
            )`
          : ""
      }
      ${networkName === 'all' ? '' : networkName ? `AND n.name = LOWER('${networkName}')` : ""}
      ${address  ? `AND u.address = LOWER('${address}')` : ""}
    ) tbl
    GROUP BY address, githubLogin
    ORDER BY COUNT(issue) ${order ? order : "DESC"}
    OFFSET ${OFFSET} LIMIT ${DEFAULT_ITEMS_PER_PAGE};
`;

  const countLeaderboard = await models.userPayments.count({
    distinct: true,
    col: "address",
  });

  const leaderboard = await Database.sequelize
    .query(leaderboardQuery, {
      type: Database.sequelize.QueryTypes.SELECT,
    })
    .then((leaderboards) => {
      return {
        count: countLeaderboard,
        rows: leaderboards.map((l) => ({
          ...l,
          ... l?.githublogin ? {user: { githubLogin: l?.githublogin }} : null,
          numberNfts: l?.numbernfts,
          chainslogos: l?.chainslogos?.split(", "),
          networkslogos: l?.networkslogos?.split(", "),
        })),
      };
    });

  return {
    ...leaderboard,
    currentPage: PAGE,
    pages: calculateTotalPages(countLeaderboard, DEFAULT_ITEMS_PER_PAGE),
  };
}