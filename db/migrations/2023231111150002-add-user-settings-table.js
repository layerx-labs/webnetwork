const { DataTypes} = require("sequelize");

module.exports = {
  up: async (queryInterface, sqlz) => {
    await queryInterface.createTable("user_settings", {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true
      },
      userId: DataTypes.INTEGER,
      notifications: DataTypes.BOOLEAN,
      language: DataTypes.STRING,
    });
  },

  down: async (queryInterface,) => {
    await queryInterface.dropTable('user_settings');
  },
};