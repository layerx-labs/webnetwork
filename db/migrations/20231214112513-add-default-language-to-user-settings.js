'use strict';

const {getAllFromTable} = require("../../helpers/db/rawQueries");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await getAllFromTable(queryInterface, "users");
    const usersSettings = await getAllFromTable(queryInterface, "user_settings");
    for (const user of users) {
      const userSettings = usersSettings?.find(u => u.userID = user.id);
      if (!userSettings)
        await queryInterface.bulkInsert("user_settings", [
          {
            language: "en",
            userId: user.id
          }
        ]);
      else
        await queryInterface.bulkUpdate("user_settings", {
          language: "en"
        }, {
          id: userSettings.id
        })
    }
  },

  async down (queryInterface, Sequelize) {
  }
};
