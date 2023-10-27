'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn("issues", "issueId");
    await queryInterface.removeColumn("issues", "githubId");
    await queryInterface.removeColumn("issues", "creatorAddress");
    await queryInterface.removeColumn("issues", "creatorGithub");
    await queryInterface.removeColumn("issues", "repository_id");
    await queryInterface.removeColumn("issues", "branch");
    await queryInterface.removeColumn("networks", "allowMerge");
    await queryInterface.dropTable("repositories");
    await queryInterface.dropTable("pull_requests");
  },
  async down (queryInterface, Sequelize) {
  }
};
