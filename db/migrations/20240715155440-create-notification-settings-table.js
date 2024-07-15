'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("notification_settings", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
      },
      userId: {
        type: Sequelize.INTEGER,
        unique: true,
        references: {
          model: "users",
          key: "id"
        }
      },
      taskOpen: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      deliverableReady: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      proposalCreated: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      proposalDisputed: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      commentsOnTasks: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      commentsOnDeliverables: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      commentsOnProposals: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("notification_settings");
  }
};
