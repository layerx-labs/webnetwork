"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("tokens", "last_price_used", {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("tokens", "last_price_used");
  },
};
