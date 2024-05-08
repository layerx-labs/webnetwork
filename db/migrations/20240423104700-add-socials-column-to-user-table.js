'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "githubLink", {type: Sequelize.STRING,});
    await queryInterface.addColumn("users", "linkedInLink", {type: Sequelize.STRING,});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "githubLink");
    await queryInterface.removeColumn("users", "linkedInLink");
  }
};
