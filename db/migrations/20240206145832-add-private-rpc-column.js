'use strict';

const { getAllFromTable } = require("../../helpers/db/rawQueries");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("chains", "privateChainRpc", {
      type: Sequelize.STRING,
    });

    const chains = await getAllFromTable(queryInterface, "chains");

    for (const chain of chains) {
      await queryInterface.bulkUpdate("chains", {
        privateChainRpc: chain.chainRpc
      }, {
        chainId: chain.chainId
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("chains", "privateChainRpc");
  }
};
