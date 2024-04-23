"use strict";
const { Model, DataTypes } = require("sequelize");

class PointsEvents extends Model {
  static init(sequelize) {
    super.init({
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      actionName: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "pointsBase",
          key: "actionName"
        }
      },
      pointsWon: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      pointsCounted: {
        type: Sequelize.BOOLEAN,
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
  }
}

module.exports = PointsEvents;