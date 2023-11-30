import { ParsedUrlQuery } from "querystring";
import { WhereOptions } from "sequelize";

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
      count(*) OVER() AS "count",
      address, 
      handle,
      COUNT(issue) AS numberNfts,
      array_to_string(array_agg(DISTINCT "logoIcon"), ', ') AS networksLogos,
      array_to_string(array_agg(DISTINCT icon), ', ') AS chainsLogos
    FROM (
      SELECT 
        up.address,
        u."handle" AS handle,
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
              u."handle" ILIKE '%${search}%'
            )`
          : ""
      }
      ${networkName === 'all' ? '' : networkName ? `AND n.name = LOWER('${networkName}')` : ""}
      ${address  ? `AND u.address = LOWER('${address}')` : ""}
    ) tbl
    GROUP BY address, handle
    ORDER BY COUNT(issue) ${order ? order : "DESC"}
    OFFSET ${OFFSET} LIMIT ${DEFAULT_ITEMS_PER_PAGE};
`;

  const leaderboard = await Database.sequelize
    .query(leaderboardQuery, {
      type: Database.sequelize.QueryTypes.SELECT,
    })
    .then((leaderboards) => {
      return {
        count: leaderboards?.length ? leaderboards[0]?.count : 0,
        rows: leaderboards.map((l) => ({
          ...l,
          ... l?.handle ? {user: { handle: l?.handle }} : null,
          numberNfts: l?.numbernfts,
          networkslogos: l?.chainslogos?.split(", "),
          marketplacelogos: l?.networkslogos?.split(", "),
        })),
      };
    });

  return {
    ...leaderboard,
    currentPage: PAGE,
    pages: calculateTotalPages(leaderboard.count, DEFAULT_ITEMS_PER_PAGE),
  };
}