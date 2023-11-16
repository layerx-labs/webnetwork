"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("tokens", "last_price_used", {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn("tokens", "icon", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("tokens", "last_price_used");
    await queryInterface.removeColumn("tokens", "icon");
  },
};
