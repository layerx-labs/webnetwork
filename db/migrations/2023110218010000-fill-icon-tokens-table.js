"use strict";
const { getAllFromTable } = require("../../helpers/db/rawQueries");
const axios = require("axios");

const COINGECKO_API = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
});

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const tokens = await getAllFromTable(queryInterface, "tokens")

      for (const token of tokens.filter((t) => !t.icon)) {

        const platforms = await COINGECKO_API.get(`/asset_platforms`).then(
          (value) => value.data
        );

        const platformByChainId = platforms.find(
          ({ chain_identifier }) => chain_identifier === token.chain_id
        );

        if (!platformByChainId) continue;

        const coin = await COINGECKO_API.get(
          `/coins/${platformByChainId.id}/contract/${token.address}`
        ).then((value) => value.data);

        if(!coin?.image?.thumb) continue;

        await queryInterface.bulkUpdate("tokens", {
            icon: coin?.image?.thumb,
          }, {
            id: token.id
          });
      }
    } catch (error) {
      console.log(
        "Failed to fill icons from tokens",
        error.toString()
      );
      throw error;
    }
  },
  down: async () => console.log()
};
