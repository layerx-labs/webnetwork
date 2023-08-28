"use strict";
const { Model, DataTypes } = require("sequelize");

class Deliverables extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          unique: true,
        },
        deliverableUrl: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        ipfsLink: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        canceled: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        markedReadyForReview: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        accepted: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        issueId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "issues",
            key: "id",
          },
        },
        bountyId: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
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
        modelName: "deliverable",
        tableName: "deliverables",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.issue, {
      foreignKey: "issueId",
      sourceKey: "id",
      as: "issue",
    });

    this.belongsTo(models.user, {
      foreignKey: "userId",
      sourceKey: "id",
      as: "user",
    });
  }
}

module.exports = Deliverables;
