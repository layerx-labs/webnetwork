'use strict';

const { getAllFromTable } = require("../../helpers/db/rawQueries");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await getAllFromTable(queryInterface, "users");

    const notificationSettings = users.map(user => ({
      userId: user.id
    }));

    await queryInterface.bulkInsert("notification_settings", notificationSettings);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("notification_settings", {});
  }
};
