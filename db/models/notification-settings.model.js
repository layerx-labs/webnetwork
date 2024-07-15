const { Model, DataTypes } = require("sequelize");

class NotificationSettings extends Model {
  static init(sequelize) {
    super.init({
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
    }, {
      sequelize,
      modelName: "notificationSettings",
      tableName: "notification_settings",
      timestamps: true
    })
  }

  static associate(models,) {
    this.belongsTo(models.user, {
      foreignKey: "userId",
      targetKey: "id"
    })
  }
}

module.exports = UserSetting;