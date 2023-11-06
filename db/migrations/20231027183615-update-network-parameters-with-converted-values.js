'use strict';

const { getDAO } = require("../../helpers/db/dao");
const { getAllFromTable } = require("../../helpers/db/rawQueries");

module.exports = {
  async up (queryInterface, Sequelize) {
    const chains = await getAllFromTable(queryInterface, "chains");
    if (!chains?.length) 
      return;
    const networks = await getAllFromTable(queryInterface, "networks");
    if (!networks.length)
      return;
    let chain = null;
    const findChain = chainId => chainId === chain?.chainId ? chain : chains.find(c => c.chainId === chainId);
    for (const network of networks) {
      chain = findChain(network.chain_id);
      const dao = await getDAO({
        web3Host: chain.chainRpc,
        networkAddress: network.networkAddress
      });
      const councilAmount = await dao.networkV2.councilAmount();
      const disputableTime = (await dao.networkV2.disputableTime()) / 1000;
      const draftTime = (await dao.networkV2.draftTime()) / 1000;
      const oracleExchangeRate = await dao.networkV2.oracleExchangeRate();
      const mergeCreatorFeeShare = await dao.networkV2.mergeCreatorFeeShare();
      const percentageNeededForDispute = await dao.networkV2.percentageNeededForDispute();
      const cancelableTime = (await dao.networkV2.cancelableTime()) / 1000;
      const proposerFeeShare = await dao.networkV2.proposerFeeShare();
      await queryInterface.bulkUpdate("networks", {
        councilAmount,
        disputableTime,
        draftTime,
        oracleExchangeRate,
        mergeCreatorFeeShare,
        percentageNeededForDispute,
        cancelableTime,
        proposerFeeShare,
      }, {
        id: chain.chainId
      });
    }
  },

  async down (queryInterface, Sequelize) {

  }
};
