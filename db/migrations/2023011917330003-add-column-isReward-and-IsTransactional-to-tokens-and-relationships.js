"use strict";

const {getAllFromTable} = require("../../helpers/db/rawQueries");
const name = "add-column-isReward-and-IsTransactional-to-tokens-and-relationships"

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('start:', name)
    await queryInterface.addColumn("tokens", "isReward", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn("network_tokens", "isTransactional", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    await queryInterface.addColumn("network_tokens", "isReward", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    const tokens = await getAllFromTable(queryInterface, "tokens");
    const removeTokens = [];
    const handleFindTokens = (newId, oldId) => removeTokens.find(id => 
      (id.new === newId || id.old === newId) || (id.new === oldId || id.old === oldId)
    );

    for (const token of tokens) {
      const currentTokens = tokens.filter(t => t.address === token.address);
      
      if(currentTokens.length === 0) return;

      if(currentTokens.length === 1) {
        await queryInterface.bulkUpdate("tokens", {
          isReward: token.isTransactional === false
        }, {
          id: token.id
        });

        await queryInterface.bulkUpdate("network_tokens", {
          isTransactional: token.isTransactional,
          isReward: token.isTransactional === false
        }, {
          tokenId: token.id
        });
      } else if(!handleFindTokens(currentTokens[0].id, currentTokens[1].id) && currentTokens[0].isAllowed === true){
        removeTokens.push({new: currentTokens[0].id, old: currentTokens[1].id})

        if(currentTokens[0].isTransactional && currentTokens[1].isAllowed === true){
          await queryInterface.bulkUpdate("tokens", {
            isReward: currentTokens[1].isTransactional === false
          }, {
            id: currentTokens[0].id
          });

          await queryInterface.bulkUpdate("network_tokens", {
            isTransactional: currentTokens[0].isTransactional,
            isReward: currentTokens[1].isTransactional === false
          }, {
            tokenId: currentTokens[0].id
          });
        } else if(currentTokens[1].isAllowed === true){
          await queryInterface.bulkUpdate("tokens", {
            isReward: true,
            isTransactional: currentTokens[1].isTransactional
          }, {
            id: currentTokens[0].id
          });

          await queryInterface.bulkUpdate("network_tokens", {
            isTransactional: currentTokens[1].isTransactional,
            isReward: true
          }, {
            tokenId: currentTokens[0].id
          });
        }
      }
    }

    for(const id of removeTokens){
      console.log(`token to be changed: ${id.new} and token to be removed: ${id.old}`)
      await queryInterface.bulkUpdate("issues", {
        tokenId: id.new
      }, {
        tokenId: id.old
      });

      await queryInterface.bulkDelete("network_tokens", {
        tokenId: id.old
      });

      await queryInterface.bulkDelete("tokens", {
        tokenId: id.old
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("tokens", "isReward");
    await queryInterface.removeColumn("network_tokens", "isTransactional");
    await queryInterface.removeColumn("network_tokens", "isReward");
  },
};
