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
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    const common = {
      pointsPerAction: 1, 
      counter: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const initialRules = [
      { actionName: "locked", ...common },
      { actionName: "delegated", ...common },
      { actionName: "created_marketplace", ...common },
      { actionName: "created_task", ...common },
      { actionName: "created_deliverable", ...common },
      { actionName: "created_proposal", ...common },
    ];

    await queryInterface.bulkInsert("points_base", initialRules);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("points_base");
  }
};
