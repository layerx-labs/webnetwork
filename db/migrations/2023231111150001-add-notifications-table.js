const { DataTypes} = require("sequelize");

module.exports = {
  up: async (queryInterface, sqlz) => {
    await queryInterface.createTable("notifications", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id"
        }
      },
      type: DataTypes.STRING,
      read: DataTypes.BOOLEAN,
      hide: DataTypes.BOOLEAN,
      uuid: {
        type: DataTypes.STRING,
        unique: true,
      },
      template: DataTypes.TEXT,
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sqlz.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sqlz.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('notifications', ['userId']);
  },

  down: async (queryInterface,) => {
    await queryInterface.dropTable('notifications');
  },
};