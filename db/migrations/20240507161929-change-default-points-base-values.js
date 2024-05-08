'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const PointsBase = (actionName, pointsPerAction, counter, scalingFactor) => ({
      actionName,
      pointsPerAction,
      counter,
      scalingFactor
    });

    const initialRules = [
      PointsBase("locked", 1, "N", 1),
      PointsBase("delegated", 1, "N", 1),
      PointsBase("created_marketplace", 1, "1", 1),
      PointsBase("created_task", 1, "N", 1),
      PointsBase("created_deliverable", 1, "1", 1),
      PointsBase("created_proposal", 1, "1", 1),
      PointsBase("accepted_proposal", 1, "1", 1),
      PointsBase("add_linkedin", 10, "1", 1),
      PointsBase("add_github", 10, "1", 1),
    ];

    for (const rule of initialRules) {
      await queryInterface.bulkUpdate("points_base", {
        pointsPerAction: rule.pointsPerAction,
        scalingFactor: rule.scalingFactor,
        counter: rule.counter,
      }, {
        actionName: rule.actionName
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkUpdate("points_base", {
      pointsPerAction: 1,
      scalingFactor: 1,
      counter: "1",
    });
  }
};
