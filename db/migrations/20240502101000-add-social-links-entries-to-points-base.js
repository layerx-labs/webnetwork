'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert("points_base",[
      {
        actionName: "add_linkedin",
        pointsPerAction: 1,
        scalingFactor: 1,
        counter: "1",
      },
      {
        actionName: "add_github",
        pointsPerAction: 1,
        scalingFactor: 1,
        counter: "1",
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("points_base", {actionName: ["linkedin", "github"]});
  }
};
