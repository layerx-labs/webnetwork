const { Model, DataTypes } = require("sequelize");

class NotificationSettings extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
      },
      userId: {
        type: DataTypes.INTEGER,
        unique: true,
        references: {
          model: "users",
          key: "id"
        }
      },
      taskOpen: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      deliverableReady: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      proposalCreated: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      proposalDisputed: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      commentsOnTasks: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      commentsOnDeliverables: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      commentsOnProposals: {
        type: DataTypes.BOOLEAN,
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

module.exports = NotificationSettings;