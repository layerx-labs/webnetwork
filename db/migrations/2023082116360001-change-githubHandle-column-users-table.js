'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('users', 'githubHandle', 'handle');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('users', 'handle', 'githubHandle');
  }
};
