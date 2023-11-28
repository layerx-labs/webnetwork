module.exports = {
  up: async (queryInterface) => {
    await queryInterface.renameColumn('users', 'githubLogin', 'handle')
  },
  down: async (queryInterface) => {
    await queryInterface.renameColumn('users', 'handle', 'githubLogin');
  }
}