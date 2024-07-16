'use strict';

const { QueryTypes } = require('sequelize');
const { fromSmartContractDecimals } = require("@taikai/dappkit");

const { getDAO, loadERC20 } = require('../../helpers/db/dao');

function decodeAndGetValue(connection, log, tokenDecimals) {
  const result = connection.Web3.eth.abi.decodeLog([
    {
      "name": "from",
      "type": "address",
      "indexed": true,
    },
    {
      "name": "to",
      "type": "address",
      "indexed": true,
    },
    {
      "name": "value",
      "type": "uint256"
    }
  ], log.data, log.topics.slice(1));

  return {
    address: result.to,
    value: +fromSmartContractDecimals(result.value, tokenDecimals)
  };
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const payments = await queryInterface.sequelize.query(`
      select	distinct payment."issueId", payment."transactionHash", "chain"."privateChainRpc" "rpc", proposal."creator" "proposer", tokens."address" "tokenAddress"
      from 	users_payments payment
        inner join issues issue on issue."id" = payment."issueId"
        inner join tokens on tokens."id" = issue."transactionalTokenId"
        inner join merge_proposals proposal on proposal."issueId" = issue."id" and proposal."contractId" = cast(issue."merged" as integer)
        inner join networks network on network."id" = issue."network_id"
        inner join chains "chain" on "chain"."chainId" = network."chain_id"
      order by "chain"."privateChainRpc"
    `, {
      type: QueryTypes.SELECT
    });

    let web3Connection = null;
    let erc20 = null;
    let paymentsToInsert = [];

    const getPayment = (address, ammount, issueId, transactionHash) => ({
      address,
      ammount,
      issueId,
      transactionHash,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    for (const payment of payments) {
      if (!web3Connection || web3Connection?.web3Host !== payment.rpc) {
        web3Connection = (await getDAO({
          web3Host: payment.rpc
        })).web3Connection;

        erc20 = null;
      }

      if (!erc20 || erc20.contractAddress !== payment.tokenAddress)
        erc20 = loadERC20(web3Connection, payment.tokenAddress);

      const receipt = await web3Connection.eth.getTransactionReceipt(payment.transactionHash);

      const merger = decodeAndGetValue(web3Connection, receipt.logs.at(1), erc20.decimals);
      const proposer = decodeAndGetValue(web3Connection, receipt.logs.at(2), erc20.decimals);

      paymentsToInsert.push(getPayment(merger.address, merger.value, payment.issueId, payment.transactionHash));
      paymentsToInsert.push(getPayment(proposer.address, proposer.value, payment.issueId, payment.transactionHash));
    }

    await queryInterface.bulkInsert("users_payments", paymentsToInsert);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
