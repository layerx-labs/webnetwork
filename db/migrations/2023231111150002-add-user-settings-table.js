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
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id"
        }
      },
      notifications: DataTypes.BOOLEAN,
      language: DataTypes.STRING,
    });

    await queryInterface.addIndex('user_settings', ['userId']);
  },

  down: async (queryInterface,) => {
    await queryInterface.dropTable('user_settings');
  },
};