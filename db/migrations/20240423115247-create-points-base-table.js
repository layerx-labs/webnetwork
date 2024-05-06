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

    const PointsBase = (actionName, pointsPerAction, counter, scalingFactor) => ({
      actionName,
      pointsPerAction,
      counter,
      scalingFactor,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const initialRules = [
      PointsBase("locked", 1, "N", 1),
      PointsBase("delegated", 1, "N", 1),
      PointsBase("created_marketplace", 1, "1", 1),
      PointsBase("created_task", 1, "N", 1),
      PointsBase("created_deliverable", 1, "1", 1),
      PointsBase("created_proposal", 1, "1", 1),
      PointsBase("accepted_proposal", 1, "1", 1),
      PointsBase("connect_email", 1, "1", 1),
    ];

    await queryInterface.bulkInsert("points_base", initialRules);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("points_base");
  }
};
