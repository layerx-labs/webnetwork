'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "profileImage", {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn("users", "profileImageUpdatedAt", {
      type: Sequelize.DATE,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "profileImage");
    await queryInterface.removeColumn("users", "profileImageUpdatedAt");
  }
};
