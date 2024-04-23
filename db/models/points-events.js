"use strict";
const { Model, DataTypes } = require("sequelize");

class PointsEvents extends Model {
  static init(sequelize) {
    super.init({
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      actionName: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "pointsBase",
          key: "actionName"
        }
      },
      pointsWon: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      pointsCounted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      }
    },
    {
      sequelize,
      modelName: "pointsEvents",
      tableName: "points_events",
      timestamps: true,
    });
  }

  static associate(models) {
    this.belongsTo(models.pointsBase, {
      foreignKey: "actionName",
      targetKey: "actionName",
      as: "pointsBase"
    });

    this.belongsTo(models.user, {
      foreignKey: "userId",
      targetKey: "id",
      as: "users"
    });
  }
}

module.exports = PointsEvents;