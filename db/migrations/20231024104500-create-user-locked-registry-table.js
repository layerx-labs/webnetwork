"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users_locked_registry", {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      amountLocked: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      tokenId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tokens",
          key: "id",
        },
      },
      chainId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "chains",
          key: "chainId",
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users_locked_registry");
  },
};
