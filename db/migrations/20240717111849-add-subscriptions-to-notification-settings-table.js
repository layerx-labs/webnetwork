'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("notification_settings", "subscriptions", {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("notification_settings", "subscriptions");
  }
};
