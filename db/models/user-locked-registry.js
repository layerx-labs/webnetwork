"use strict";
const { getValueToLowerCase } = require("../../helpers/db/getters");
const { Model, DataTypes } = require("sequelize");

class UserLockedRegistry extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          unique: true,
        },
        address: {
          type: DataTypes.STRING,
          allowNull: false,
          get() {
            return getValueToLowerCase(this, "address");
          },
        },
        amountLocked: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        tokenId: {
          type: DataTypes.STRING,
          allowNull: false,
          references: {
            model: "tokens",
            key: "id",
          },
        },
        chainId: {
          type: DataTypes.INTEGER,
          references: {
            model: "chain",
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
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
      },
      {
        sequelize,
        modelName: "userLockedRegistry",
        tableName: "users_locked_registry",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.tokens, {
      foreignKey: "tokenId",
      sourceKey: "id",
      as: "token",
    });

    this.belongsTo(models.chain, {
      foreignKey: "chainId",
      targetKey: "chainId",
      as: "chain",
    });

    this.belongsTo(models.user, {
      foreignKey: "userId",
      sourceKey: "id",
      as: "user",
    });
  }
}

module.exports = UserLockedRegistry;
