'use strict';

const { getAllFromTable } = require("../../helpers/db/rawQueries");
const { getDAO } = require("../../helpers/db/dao");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("chains", "startBlock", {
      type: Sequelize.INTEGER
    });

    const chains = await getAllFromTable(queryInterface, "chains");

    for (const chain of chains) {
      const { web3Connection } = await getDAO({
        web3Host: chain.chainRpc
      });

      const lastBlock = (await web3Connection.Web3.eth.getBlock("latest")).number;

      await queryInterface.bulkUpdate("chains", {
        startBlock: lastBlock
      }, {
        chainId: chain.chainId
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("chains", "startBlock");
  }
};
