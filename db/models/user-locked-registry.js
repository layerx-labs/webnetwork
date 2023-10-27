"use strict";
const { Model, DataTypes } = require("sequelize");

class UserLockedRegistry extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        address: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        amountLocked: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        tokenId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "tokens",
            key: "id",
          },
        },
        chainId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "chains",
            key: "chainId",
          },
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "users",
            key: "id",
          },
        },
      },
      {
        sequelize,
        tableName: "users_locked_registry",
        modelName: "userLockedRegistry",
      }
    );
  }
  static associate(models) {}
}

module.exports = UserLockedRegistry;
