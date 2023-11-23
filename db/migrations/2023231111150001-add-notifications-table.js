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
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id"
        },
      },
      read: DataTypes.BOOLEAN,
      uuid: DataTypes.STRING,
    });

    await queryInterface.addIndex('notifications', ['userId']);
  },

  down: async (queryInterface,) => {
    await queryInterface.dropTable('notifications');
  },
};