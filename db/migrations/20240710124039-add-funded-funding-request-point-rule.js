'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("points_base", [
      {
        actionName: "funded_funding_request",
        pointsPerAction: 1,
        scalingFactor: 3,
        counter: "N",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("points_base", {
      actionName: "funded_funding_request"
    });
  }
};
