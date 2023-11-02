'use strict';
const { getDAO } = require("../../helpers/db/dao");
const { getAllFromTable } = require("../../helpers/db/rawQueries");

module.exports = {
  async up (queryInterface, Sequelize) {
    const chains = await getAllFromTable(queryInterface, "chains");
    if (!chains?.length) 
      return;
    for (const chain of chains) {
      const networks = await getAllFromTable(queryInterface, "networks");
      if (!networks?.length) 
        continue;
      const dao = await getDAO({
        web3Host: chain.chainRpc,
        registryAddress: chain.registryAddress,
        networkAddress: networks[0].networkAddress
      });
      const treasuryInfo = await dao.networkV2.treasuryInfo();
      const lockAmountForNetworkCreation = await dao.networkRegistry.lockAmountForNetworkCreation();
      const networkCreationFeePercentage = await dao.networkRegistry.networkCreationFeePercentage();
      await queryInterface.bulkUpdate("chains", {
        lockAmountForNetworkCreation: lockAmountForNetworkCreation,
        networkCreationFeePercentage: networkCreationFeePercentage,
        closeFeePercentage: treasuryInfo.closeFee,
        cancelFeePercentage: treasuryInfo.cancelFee
      }, {
        chainId: chain.chainId
      });
    }
  },

  async down (queryInterface, Sequelize) {
    
  }
};
