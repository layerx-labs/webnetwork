/* eslint-disable no-prototype-builtins */
const {QueryTypes} = require("sequelize");

const {Chain} = require("../models/chain.model");
const {UserLockedRegistry} = require("../models/user-locked-registry");

const {Web3Connection, NetworkRegistry, fromSmartContractDecimals} = require("@taikai/dappkit");
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
          web3Host: chain.chainRpc,
        });
  
        await web3Connection.start();

        const registry = new NetworkRegistry(web3Connection, chain.registryAddress);
        await registry.loadContract();
        await registry.start();

        const contractToken = registry.token
  
        const blockNumber = await registry._contract.web3.eth.getBlockNumber();
  
        const paginateRequest = async (pool = [], name, fn) => {
  
          const startBlock = +(process.env.MIGRATION_START_BLOCK || 0);
          const endBlock = blockNumber;
          const perRequest = +(process.env.EVENTS_PER_REQUEST || 1500);
          const requests = Math.ceil((endBlock - startBlock) / perRequest);
  
          let toBlock = 0;
  
          console.log(`Fetching ${name} total of ${requests}, from: ${startBlock} to ${endBlock} - chainId:${chain.chainId}`);
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

          const newUserAmount = BigNumber(fromSmartContractDecimals(newAmount || 0, registry.token.decimals));

          const user_locked_registry = await queryInterface.sequelize.query(
              'SELECT * FROM users_locked_registry WHERE LOWER(address) = LOWER(:address) AND "chainId" = :chainId',
              {
              replacements: {address: user, chainId: chain.chainId},
              type: QueryTypes.SELECT,
              }
          );          
          
          if(user_locked_registry[0]){
            const query = `UPDATE users_locked_registry SET "amountLocked" = $amountLocked WHERE id = $id`;

            await queryInterface.sequelize.query(query, {
                bind: {
                  amountLocked: newUserAmount?.toFixed(),
                  id: user_locked_registry[0].id,
                },
              });

            UsersLockedRegistryUpdated += 1
          } else {

            const dbUser = await queryInterface.sequelize.query(
                'SELECT * FROM users WHERE LOWER(address) = LOWER(:address)',
                {
                replacements: {address: user},
                type: QueryTypes.SELECT,
                }
            ); 

            const dbToken = await queryInterface.sequelize.query(
                'SELECT * FROM tokens WHERE LOWER(address) = LOWER(:address) AND "chain_id" = :chain_id',
                {
                replacements: {address: contractToken.contractAddress?.toLowerCase(), chain_id: chain.chainId},
                type: QueryTypes.SELECT,
                }
            ); 

            if(dbToken[0]){
              await queryInterface.insert(UserLockedRegistry, "users_locked_registry", {
                address: user,
                userId: dbUser[0]?.id || null,
                amountLocked: newUserAmount?.toFixed(),
                chainId: chain.chainId,
                tokenId: dbToken[0]?.id,
                createdAt: new Date(),
                updatedAt: new Date(),
              });

              UsersLockedRegistryUpdated += 1
            } else console.log(`token not found - userAddress: ${user} - tokenAddress: ${contractToken.contractAddress}` )
           
          }
  
          await sleep();
        }
  
      }
  
      console.log("Number of changes in users_locked_registry table", UsersLockedRegistryUpdated);
    },
  };