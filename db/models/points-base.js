"use strict";
const { Model, DataTypes } = require("sequelize");

class PointsBase extends Model {
  static init(sequelize) {
    super.init({
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      actionName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      pointsPerAction: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      scalingFactor: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 1
      },
      counter: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "pointsBase",
      tableName: "points_base",
      timestamps: true,
    });
  }

  static associate(models) {
    this.hasMany(models.pointsEvents, {
      foreignKey: "actionName",
      targetKey: "actionName",
      as: "pointsEvents"
    });
  }
}

module.exports = PointsBase;