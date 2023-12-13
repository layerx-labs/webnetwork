const {Model, DataTypes} = require("sequelize");

class UserSetting extends Model {
  static init(sequelize) {
    super.init({
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "user",
          key: "id"
        }
      },
      notifications: DataTypes.BOOLEAN,
      language: DataTypes.STRING,
    }, {
      sequelize,
      modelName: "userSetting",
      tableName: "user_settings",
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