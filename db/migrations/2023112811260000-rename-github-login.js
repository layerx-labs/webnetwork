module.exports = {
  up: async (queryInterface) => {
    await queryInterface.renameColumn('users', 'githubLogin', 'handle');
    await queryInterface.renameColumn('merge_proposals', 'githubLogin', 'handle');
  },
  down: async (queryInterface) => {
    await queryInterface.renameColumn('users', 'handle', 'githubLogin');
    await queryInterface.renameColumn('merge_proposals', 'handle', 'githubLogin');
  }
}