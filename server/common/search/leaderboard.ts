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
      avatar,
      COUNT(issue) AS numberNfts,
      array_to_string(array_agg(DISTINCT "logoIcon"), ', ') AS networksLogos,
      array_to_string(array_agg(DISTINCT icon), ', ') AS chainsLogos
    FROM (
      select	users."address",
            users."handle",
            users."avatar",
            issue."id" "issue",
            network."logoIcon",
            chains."icon"
      from	issues issue
        inner join merge_proposals proposal on proposal."issueId" = issue."id" 
          and proposal."contractId" = cast(issue."merged" as integer)
        inner join proposal_distributions distribution on distribution."proposalId" = proposal."id"
        inner join users on lower(users."address") = lower(distribution."recipient")
        inner join networks network on network."id" = issue."network_id"
        inner join chains on chains."chainId" = issue."chain_id"
      where	issue."state" = 'closed'
      ${
        search
          ? `AND (
              users."address" ILIKE '%${search}%' OR
              users."handle" ILIKE '%${search}%'
            )`
          : ""
      }
      ${networkName === 'all' ? '' : networkName ? `AND network."name" = LOWER('${networkName}')` : ""}
      ${address  ? `AND users."address" = LOWER('${address}')` : ""}
    ) tbl
    GROUP BY address, handle, avatar
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
          ... l?.handle ? {user: { handle: l?.handle, avatar: l?.avatar }} : null,
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