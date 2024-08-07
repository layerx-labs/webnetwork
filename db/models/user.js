"use strict";
const { getValueToLowerCase } = require("../../helpers/db/getters");
const { Model, DataTypes, Sequelize } = require("sequelize");

class User extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static init(sequelize) {
    super.init({
      handle: {
        type: DataTypes.STRING, 
        allowNull: true
      },
      address: { 
        type: DataTypes.STRING, 
        unique: true,
        get() {
          return getValueToLowerCase(this, "address");
        }
      },
      resetedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        unique: true
      },
      isEmailConfirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      emailVerificationCode: {
        type: DataTypes.STRING
      },
      emailVerificationSentAt: {
        type: DataTypes.DATE
      },
      githubLink: {
        type: DataTypes.STRING,
      },
      linkedInLink: {
        type: DataTypes.STRING,
      },
      twitterLink: {
          type: DataTypes.STRING,
      },
      totalPoints: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
      },
      about: {
        type: DataTypes.STRING(512),
        allowNull: true,
        defaultValue: ""
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true
      },
      profileImageUpdatedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "user",
      defaultScope: {
        attributes: {
          exclude: ["emailVerificationCode", "email", "isEmailConfirmed", "emailVerificationSentAt"]
        }
      },
      scopes: {
        ownerOrGovernor: {
          attributes: {
            exclude: ["emailVerificationCode"]
          },
          include: [
            { association: "settings" }
          ]
        },
        admin: {}
      }
    });
  }

  static associate(models) {
    this.belongsTo(models.kycSession, {
      foreignKey: "id",
      sourceKey: "id"
    });

    this.hasMany(models.issue, {
      foreignKey: "userId",
      sourceKey: "id",
      as: "issues"
    });

    this.hasMany(models.curator, {
      foreignKey: "address",
      sourceKey: "address",
      as: "curation"
    });

    this.hasOne(models.userSetting, {
      foreignKey: "userId",
      sourceKey: "id",
      as: "settings"
    });

    this.hasMany(models.notification, {
      foreignKey: "userId",
      sourceKey: "id",
      as: "notifications"
    });

    this.hasMany(models.mergeProposal, {
      foreignKey: "creator",
      sourceKey: "address",
      as: "mergeProposals"
    });

    this.hasMany(models.userPayments, {
      foreignKey: "address",
      sourceKey: "address",
      as: "payments"
    });

    this.hasMany(models.pointsEvents, {
      foreignKey: "userId",
      sourceKey: "id",
      as: "pointsEvents"
    });

    this.hasMany(models.comment, {
      foreignKey: "userId",
      sourceKey: "id",
      as: "comments"
    });

    this.hasOne(models.notificationSettings, {
      foreignKey: "userId",
      sourceKey: "id",
      as: "notificationSettings"
    });
  }

  static findByAddress(address) {
    return this.findOne({
      where: {
        address: Sequelize.where(Sequelize.fn("lower", Sequelize.col("address")), address?.toLowerCase())
      },
      include: [{ association: "settings" }]
    });
  }

  static findByhandle(handle) {
    return this.findOne({
      where: {
        address: Sequelize.where(Sequelize.fn("lower", Sequelize.col("handle")), handle?.toLowerCase())
      }
    });
  }
}

module.exports = User;
