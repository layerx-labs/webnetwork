'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkUpdate("points_base", {
      counter: "N"
    }, {
      actionName: ["created_proposal", "created_deliverable", "accepted_proposal"]
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkUpdate("points_base", {
      counter: "1"
    }, {
      actionName: ["created_proposal", "created_deliverable", "accepted_proposal"]
    });
  }
};
