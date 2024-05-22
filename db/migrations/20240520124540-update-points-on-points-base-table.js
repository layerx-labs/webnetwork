'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const rules = [
      { name: "connect_email", pointsPerAction: 10, counter: "1", },
      { name: "locked", pointsPerAction: 1, counter: "N", },
      { name: "delegated", pointsPerAction: 1, counter: "N", },
      { name: "created_marketplace", pointsPerAction: 100, counter: "1", },
      { name: "created_task", pointsPerAction: 1, counter: "N", },
      { name: "created_deliverable", pointsPerAction: 10, counter: "1", },
      { name: "created_proposal", pointsPerAction: 10, counter: "1", },
      { name: "accepted_proposal", pointsPerAction: 10, counter: "1", },
      { name: "add_linkedin", pointsPerAction: 10, counter: "1", },
      { name: "add_github", pointsPerAction: 10, counter: "1", },
      { name: "add_about", pointsPerAction: 20, counter: "1", },
    ];

    for (const rule of rules) {
      await queryInterface.bulkUpdate("points_base", {
        pointsPerAction: rule.pointsPerAction,
        counter: rule.counter
      }, {
        actionName: rule.name
      });
    }
  },

  async down (queryInterface, Sequelize) {
  }
};
