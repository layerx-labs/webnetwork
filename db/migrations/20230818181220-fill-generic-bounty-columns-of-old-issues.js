'use strict';

const { default: BigNumber } = require("bignumber.js");
const { getAllFromTable } = require("../../helpers/db/rawQueries");
const { sendToIpfs } = require("../../helpers/db/ipfs");

module.exports = {
  async up (queryInterface, Sequelize) {
    const issues = await getAllFromTable(queryInterface, "issues");
    const repositories = await getAllFromTable(queryInterface, "repositories");
    const networks = await getAllFromTable(queryInterface, "networks");

    let repository = null;
    let network = null;

    const findRepository = id => repositories.find(repo => repo.id === id);
    const findNetwork = id => networks.find(repo => repo.id === id);

    for (const issue of issues) {
      if (issue.repository_id !== repository?.id)
        repository = findRepository(issue.repository_id);

      if (issue.network_id !== network?.id)
        network = findNetwork(issue.network_id);

      const [owner, repo] = repository?.githubPath?.split("/");

      const bountyJson = {
        name: issue.title,
        properties: {
          type: "github",
          deliverable: `https://github.com/${owner}/${repo}#${issue.branch}`,
          bountyId: issue.contractId,
          chainId: issue.chain_id,
          networkName: network.name,
          price: BigNumber.max(issue.amount, issue.fundingAmount).toString(),
          tags: issue.tags,
          kycNeeded: issue.isKyc
        }
      };

      const ipfsHash = await sendToIpfs(bountyJson, true);

      await queryInterface.bulkUpdate("issues", {
        type: "code",
        ipfsUrl: ipfsHash
      }, {
        id: issue.id
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkUpdate("issues", {
      type: null,
      ipfsUrl: null
    });
  }
};
