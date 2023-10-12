/* eslint-disable no-prototype-builtins */
const {QueryTypes} = require("sequelize");

const {Chain} = require("../models/chain.model");

const {Web3Connection, NetworkRegistry} = require("@taikai/dappkit");
const BigNumber = require("bignumber.js");
require("dotenv").config();

module.exports = {
    up: async (queryInterface, Sequelize) => {
      if (process.env?.SKIP_MIGRATION_SEED_USERS_LOCKED_REGISTRY?.toLowerCase() === "true")
        return console.log("SKIP_MIGRATION_SEED_USERS_LOCKED_REGISTRY STEP");
  
      const sleep = (ms = 100) => new Promise(r => setTimeout(r, ms));
  
      const chains = await queryInterface.sequelize.query(
        "SELECT * FROM chains",
        {
          model: Chain,
          mapToModel: true,
          type: QueryTypes.SELECT,
        }
      );
  
      if (!chains.length) return;
  
      console.log("Begin create and change users_locked_registry");
      console.log("Chains to verify: ", chains.length);
  
      let UsersLockedRegistryUpdated = 0;
  
      for (const chain of chains) {
        if (!chain.registryAddress) return;
  
        const web3Connection = new Web3Connection({
          skipWindowAssignment: true,
          web3Host: process.env.NEXT_PUBLIC_WEB3_CONNECTION,
        });
  
        await web3Connection.start();

        const registry = new NetworkRegistry(web3Connection, chain.registryAddress);
        await registry.loadContract();
        await registry.start();
  
        const blockNumber = await registry._contract.web3.eth.getBlockNumber();
  
        const paginateRequest = async (pool = [], name, fn) => {
  
          const startBlock = +(process.env.MIGRATION_START_BLOCK || 0);
          const endBlock = blockNumber;
          const perRequest = +(process.env.EVENTS_PER_REQUEST || 1500);
          const requests = Math.ceil((endBlock - startBlock) / perRequest);
  
          let toBlock = 0;
  
          console.log(`Fetching ${name} total of ${requests}, from: ${startBlock} to ${endBlock}`);
          for (let fromBlock = startBlock; fromBlock < endBlock; fromBlock += perRequest) {
            toBlock = fromBlock + perRequest > endBlock ? endBlock : fromBlock + perRequest;
  
            console.log(`${name} fetch from ${fromBlock} to ${toBlock} (missing ${Math.ceil((endBlock - toBlock) / perRequest)})`);
  
            const result = await registry.getUserLockedAmountChangedEvents({fromBlock, toBlock});
  
            pool.push(...result);
  
            await sleep();
          }
        }

        const getUserLockedAmountChangedEvents = []
        await paginateRequest(getUserLockedAmountChangedEvents, `getUserLockedAmountChangedEvents`);

        const mappedUserLockedAmountChanged = getUserLockedAmountChangedEvents.map(({ returnValues }) => returnValues)
  
        for (const { user, newAmount } of mappedUserLockedAmountChanged) {
  
          const resultChangedEvent = 
  
          UsersLockedRegistryUpdated += resultChangedEvent ? 1 : 0;
  
          await sleep();
        }
  
      }
  
      console.log("Number of changes in users_locked_registry table", UsersLockedRegistryUpdated);
    },
  };