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
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "user",
          key: "id"
        }
      },
      type: DataTypes.STRING,
      read: DataTypes.BOOLEAN,
      hide: DataTypes.BOOLEAN,
      uuid: DataTypes.STRING,
    }, {
      sequelize,
      modelName: "notification",
      tableName: "notifications",
      timestamps: true,
    })
  }

  static associate(models,) {
    this.belongsTo(models.user, {
      foreignKey: "userId",
      targetKey: "id",
      as: "user"
    })
  }
}

module.exports = Notification;