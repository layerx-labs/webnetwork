"use strict";
const { getValueToLowerCase } = require("../../helpers/db/getters");
const { Model, DataTypes } = require("sequelize");

class Comments extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          unique: true,
        },
        comment: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        hidden: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        issueId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "issues",
            key: "id",
          },
        },
        proposalId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "merge_proposals",
            key: "id",
          },
        },
        deliverableId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "pull_requests",
            key: "id",
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
        userAddress: {
          type: DataTypes.STRING,
          allowNull: false,
          get() {
            return getValueToLowerCase(this, "userAddress");
          },
        },
        replyId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "issues",
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
        modelName: "comment",
        tableName: "comments",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.issue, {
      foreignKey: "issueId",
      sourceKey: "id",
      as: "issue",
    });

    this.belongsTo(models.pullRequest, {
      foreignKey: "pullRequestId",
      sourceKey: "id",
      as: "deliverable",
    });

    this.belongsTo(models.mergeProposal, {
      foreignKey: "proposalId",
      sourceKey: "id",
      as: "proposal",
    });

    this.belongsTo(models.user, {
      foreignKey: "userId",
      sourceKey: "id",
      as: "user",
    });

    this.belongsTo(models.user, {
      foreignKey: "replyId",
      sourceKey: "id",
      as: "reply",
    });
    
  }
}

module.exports = Comments;
