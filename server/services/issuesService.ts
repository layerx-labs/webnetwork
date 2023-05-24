import { Op, Sequelize, WhereOptions } from "sequelize";

import models from "db/models";
import Issue from "db/models/issue.model";

import handleNetworkValues from "helpers/handleNetworksValuesApi";
import { paginateArray } from "helpers/paginate";

import { IssueResponse } from "types/issue";

// Function to create a condition for a case insensitive search
function iLikeCondition(key: string, value: string) {
  return { [key]: { [Op.iLike]: value } };
}

// Mapping of the filters to the database fields
const filterMappings: Record<string, (value) => WhereOptions> = {
  state: (value) => ({ state: value }),
  issueId: (value) => ({ issueId: value }),
  repoId: (value) => ({ repository_id: value }),
  creator: (value) => ({ creatorGithub: value }),
  address: (value) => ({ creatorAddress: { [Op.iLike]: value.toString() } }),
  pullRequesterLogin: (value) => ({ pullRequesterGithub: value }),
  pullRequesterAddress: (value) => ({
    pullRequesterAddress: { [Op.iLike]: value.toString() },
  }),
  proposer: (value) => ({ proposerGithub: value }),
  networkName: (value) => ({ networkName: value }),
  allNetworks: (value) => ({
    networkName: { [Op.in]: handleNetworkValues(value) },
  }),
  repoPath: (value) => ({ repoPath: value }),
  tokenAddress: (value) => ({ tokenAddress: value }),
  chainId: (value) => ({ chainId: value }),
};

/**
 * @dev Get issues from the database with the given filters and pagination options
 * @param quer
 * @returns object with the issues and pagination data
 */
export async function getIssuesService(query): Promise<IssueResponse> {
  const { visible, search, page, ...filters } = query;

  const whereCondition: WhereOptions = visible
    ? { state: { [Op.notIn]: ["pending", "canceled"] } }
    : { state: { [Op.not]: "pending" } };

  if (visible) whereCondition.visible = visible;

  Object.entries(filters).forEach(([key, value]) => {
    if (filterMappings[key]) {
      const filterCondition = filterMappings[key](value);
      Object.assign(whereCondition, filterCondition);
    }
  });

  const include = [
    {
      association: "developers",
    },
    {
      association: "pullRequests",
      required: !!query.pullRequesterLogin || !!query.pullRequesterAddress,
      where: {
        status: {
          [Op.not]: "canceled",
        },
        ...(query.pullRequesterLogin || query.pullRequesterAddress
          ? {
              [Op.or]: [
                iLikeCondition("githubLogin", query.pullRequesterLogin),
                iLikeCondition("userAddress", query.pullRequesterAddress),
              ],
          }
          : {}),
      },
    },
    {
      association: "mergeProposals",
      required: !!query.proposer,
      where: query.proposer
        ? {
            [Op.or]: [
              iLikeCondition("githubLogin", query.proposer),
              iLikeCondition("creator", query.proposer),
            ],
        }
        : {},
    },
    {
      association: "repository",
      attributes: ["id", "githubPath"],
    },
    {
      association: "transactionalToken",
      required: !!query.tokenAddress,
      where: query.tokenAddress
        ? {
            address: { [Op.iLike]: query.tokenAddress },
        }
        : {},
    },
    {
      association: "network",
      include: [
        {
          association: "chain",
        },
      ],
    },
  ];

  let issues: Issue[];

  if (search) {
    const searchCondition: WhereOptions = {
      [Op.or]: [
        { title: { [Op.iLike]: `%${search}%` } },
        { body: { [Op.iLike]: `%${search}%` } },
        { issueId: { [Op.iLike]: `%${search}%` } },
        { creatorGithub: { [Op.iLike]: `%${search}%` } },
        { creatorAddress: { [Op.iLike]: `%${search}%` } },
      ],
    };

    issues = await models.issue
      .findAll({
        where: {
          ...whereCondition,
          ...searchCondition,
        },
        include,
        nest: true,
        order: [["createdAt", query.order || "DESC"]],
      })
      .then((data) => handleNetworkValues(data));
  } else {
    issues = await models.issue
      .findAll({
        where: whereCondition,
        include,
        nest: true,
        order: [["createdAt", query.order || "DESC"]],
      })
      .then((data) => handleNetworkValues(data));
  }

  const paginatedData = paginateArray(issues, 10, page || 1);

  return {
    count: issues.length,
    results: paginatedData.data,
    pages: paginatedData.pages,
    currentPage: +paginatedData.page,
  };
}
