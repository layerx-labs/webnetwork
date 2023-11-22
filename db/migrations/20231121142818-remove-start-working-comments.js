'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("comments", {
      comment: "I'm working on this task"
    });
  },

  async down (queryInterface, Sequelize) {
  }
};
