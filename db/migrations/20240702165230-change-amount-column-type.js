'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn("users_payments", "ammount", {
      type: Sequelize.FLOAT
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn("users_payments", "ammount", {
      type: Sequelize.INTEGER
    });
  }
};
