'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("points_base", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      actionName: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      pointsPerAction: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      scalingFactor: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 1
      },
      counter: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });

    const initialRules = [
      { actionName: "locked", pointsPerAction: 1, counter: "1" },
      { actionName: "delegated", pointsPerAction: 1, counter: "1" },
      { actionName: "created_marketplace", pointsPerAction: 1, counter: "1" },
      { actionName: "created_task", pointsPerAction: 1, counter: "1" },
      { actionName: "created_deliverable", pointsPerAction: 1, counter: "1" },
      { actionName: "created_proposal", pointsPerAction: 1, counter: "1" },
    ];

    await queryInterface.bulkInsert("points_base", initialRules);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("points_base");
  }
};
