const {Model, DataTypes} = require("sequelize");

class Notification extends Model {
  static init(sequelize) {
    super.init({
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true
      },
      userId: DataTypes.INTEGER,
      notifications: DataTypes.BOOLEAN,
      language: DataTypes.STRING,
    }, {
      sequelize,
      modelName: "userSetting",
      tableName: "user_settings",
      createdAt: true
    })
  }

  static associate(models,) {
    this.belongsTo(models.user, {
      foreignKey: "id",
      targetKey: "userId"
    })
  }
}

module.exports = Notification;