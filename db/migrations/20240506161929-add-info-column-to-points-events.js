'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("points_events", "info", {
      type: Sequelize.JSON
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("points_events", "info");
  }
};
