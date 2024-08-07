'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("notification_settings", "replyOnThreads", {
      type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("notification_settings", "replyOnThreads");
  }
};
