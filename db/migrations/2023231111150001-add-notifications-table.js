const { DataTypes} = require("sequelize");

module.exports = {
  up: async (queryInterface, sqlz) => {
    await queryInterface.createTable("notifications", {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true
      },
      type: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      read: DataTypes.BOOLEAN,
      uuid: DataTypes.STRING,
    });
  },

  down: async (queryInterface,) => {
    await queryInterface.dropTable('notifications');
  },
};