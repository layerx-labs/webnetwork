'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("issues", "ipfsUrl", {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn("issues", "type", {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn("issues", "origin", {
      type: Sequelize.STRING
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("issues", "ipfsUrl");
    await queryInterface.removeColumn("issues", "type");
    await queryInterface.removeColumn("issues", "origin");
  }
};
