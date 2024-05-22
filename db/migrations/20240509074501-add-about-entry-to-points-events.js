'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert("points_base",[
      {
        actionName: "add_about",
        pointsPerAction: 20,
        scalingFactor: 1,
        counter: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("points_base", {actionName: ["add_about"]});
  }
};