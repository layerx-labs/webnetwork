module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("chain_events", "contract_address", {type: Sequelize.STRING});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("chains", "contract_address");
  }
};