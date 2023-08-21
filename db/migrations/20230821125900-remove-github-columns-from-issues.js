'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn("issues", "issueId");
    await queryInterface.removeColumn("issues", "githubId");
    await queryInterface.removeColumn("issues", "repository_id");
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn("issues", "issueId", {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn("issues", "githubId", {
      type: Sequelize.STRING
    });

    await queryInterface.addColumn("issues", "repository_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "repositories",
        key: "id"
      }
    });
  }
};
