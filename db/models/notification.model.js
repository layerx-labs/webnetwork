const {Model, DataTypes} = require("sequelize");

class Notification extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
      },
      userId: DataTypes.INTEGER,
      type: DataTypes.STRING,
      read: DataTypes.BOOLEAN,
      uuid: DataTypes.STRING,
    }, {
      sequelize,
      modelName: "notification",
      tableName: "notifications",
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