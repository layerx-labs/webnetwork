'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "github_link", {type: Sequelize.STRING,});
    await queryInterface.addColumn("users", "linkedin_link", {type: Sequelize.STRING,});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "githubLink");
    await queryInterface.removeColumn("users", "linkedInLink");
  }
};
