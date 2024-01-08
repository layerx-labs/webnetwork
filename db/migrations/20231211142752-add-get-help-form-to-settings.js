'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("settings", [{
      key: "createMarketplaceHelp",
      value: "https://layerx.typeform.com/to/o31JUE8t",
      type: "string",
      visibility: "public",
      group: "forms",
      createdAt: new Date(),
      updatedAt: new Date(),
    }]).catch(error => console.log("Failed to insert", error.toString()));
  },

  async down (queryInterface, Sequelize) {
  }
};
